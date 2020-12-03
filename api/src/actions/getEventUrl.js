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
}
`;

module.exports = async function getEventUrl(req, res) {
  // const user = getUser(req);
  const { user_id, event_id } = req.body.input;

  // user.isAdmin = user['https://hasura.io/jwt/claims'][
  //   'x-hasura-allowed-roles'
  // ].includes('admin');

  try {
    let { data } = await execute(
      GET_MUX_ID,
      { user_id, event_id },
      req.headers
    );

    if (!data.transactions.length) {
      res.send('');
    }

    let mux_asset_id = data.transactions[0].event.mux_asset_id;

    const playbackId = await Video.Assets.createPlaybackId(mux_asset_id, {
      policy: 'signed'
    });
    const token = Mux.JWT.sign(playbackId.id);
    res.send(`https://stream.mux.com/${playbackId.id}.m3u8?token=${token}`);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};
