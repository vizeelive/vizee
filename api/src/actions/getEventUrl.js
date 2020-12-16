const { getUser } = require('../lib');
const execute = require('../execute');
const dayjs = require('dayjs');
const { getEvent } = require('../queries');

const Mux = require('@mux/mux-node');
const { Video } = new Mux();

const GET_MUX_ID = `
query getUserAccess($user_id: uuid!, $expiry: timestamptz!, $account_id: uuid!, $event_id: uuid!) {
  events_by_pk(id: $event_id) {
    mux_asset_id
  }
  eventAccess: users_access(where: {event_id: {_eq: $event_id}, user_id: {_eq: $user_id}, expiry: {_gt: $expiry}}) {
		id
  }
  accountAccess: users_access(where: {account_id: {_eq: $account_id}, user_id: {_eq: $user_id}, expiry: {_gt: $expiry}}) {
		id
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

  let expiry = dayjs().format('YYYY-MM-DD HH:mm:ss');

  try {
    let event = await getEvent(event_id);

    let { data } = await execute(
      GET_MUX_ID,
      { user_id, event_id, account_id: event.account_id, expiry },
      req.headers
    );

    if (
      !user.isAdmin &&
      !data.eventAccess.length &&
      !data.accountAccess.length
    ) {
      return res.send({ url: null });
    }

    let mux_asset_id = data.events_by_pk.mux_asset_id;

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
