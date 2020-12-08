const { getUser } = require('../lib');
const execute = require('../execute');

const Mux = require('@mux/mux-node');
const { Video } = new Mux();

const GET_MUX_ID = `
query GetUserEventTransaction($user_id: uuid!, $event_id: uuid!) {
  transactions(where: {user_id: {_eq: $user_id}, event_id: {_eq: $event_id}}) {
    event {
      mux_asset_id
    }
  }
  access_codes(where: {user_id: {_eq: $user_id}, event_id: {_eq: $event_id}}) {
    id
    event {
      mux_asset_id
    }
  }
  events_by_pk(id: $event_id) {
    mux_asset_id
  }
}
`;

module.exports = async function getEventUrl(req, res) {
  const user = getUser(req);
  const { id: event_id } = req.body.input;
  const user_id = user['https://hasura.io/jwt/claims']['x-hasura-user-id'];

  user.isAdmin = user['https://hasura.io/jwt/claims'][
    'x-hasura-allowed-roles'
  ].includes('admin');

  try {
    let { data } = await execute(
      GET_MUX_ID,
      { user_id, event_id },
      req.headers
    );

    if (!user.isAdmin && !data.transactions.length && !data.access_codes.length) {
      return res.send({ url: null });
    }

    let mux_asset_id;
    if (user.isAdmin) {
      mux_asset_id = data.events_by_pk.mux_asset_id;
    } else {
      mux_asset_id = data?.transactions?.[0]?.event?.mux_asset_id || data?.access_codes?.event?.mux_asset_id;
    }

    if (!mux_asset_id) {
      return res.send({ url: null });
    }

    const playbackId = await Video.Assets.createPlaybackId(mux_asset_id, {
      policy: 'signed'
    });
    const token = Mux.JWT.sign(playbackId.id);
    res.send({
      url: `https://stream.mux.com/${playbackId.id}.m3u8?token=${token}`
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};
