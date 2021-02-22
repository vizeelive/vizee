const dayjs = require('dayjs');
const logger = require('../logger');
const { getEvent, getUserAccess } = require('../queries');
const { createToken, createPlaybackId } = require('../lib/mux');

module.exports = async function (params) {
  const { user, event_id } = params;

  let expiry = dayjs().format('YYYY-MM-DD HH:mm:ss');

  let event = await getEvent(event_id);

  let data = await getUserAccess({
    user_id: user.id,
    event_id,
    account_id: event.account_id,
    expiry
  });

  if (data.event.type !== 'live' && !data.event.mux_asset_id) {
    logger.info('Event has no mux_asset_id, skipping');
    return { url: null };
  }

  if (
    data.event.price !== '$0.00' &&
    !event.account.users.find((u) => u.user.id === user.id) &&
    !user.isAdmin &&
    !data.eventAccess.length &&
    !data.accountAccess.length
  ) {
    logger.info('Event has no access, skipping');
    return { url: null };
  }

  if (!data.event.published) {
    logger.info('Event is not published, denying');
    return { url: null };
  }

  if (
    data.event.type === 'live' &&
    data.event.stream_type === 'mux' &&
    !data.event.mux_livestream?.playback_ids
  ) {
    logger.info('Live event does not have a playback id');
    return { url: null };
  }

  if (data.event.type === 'video' && !data.event.mux_asset_id) {
    logger.info('Video event does not have a mux asset id');
    return { url: null };
  }

  let playbackId;
  if (data.event.type === 'live' && data.event.stream_type === 'mux') {
    playbackId = data?.event?.mux_livestream?.playback_ids[0];
  } else if (
    data.event.type === 'live' &&
    data.event.stream_type === 'ivs_fast'
  ) {
    return {
      url: data?.event?.mux_livestream?.channel?.playbackUrl
    };
  } else {
    playbackId = await createPlaybackId(data.event.mux_asset_id, {
      policy: 'signed'
    });
  }

  const token = createToken(playbackId.id);

  return {
    url: `https://stream.mux.com/${playbackId.id}.m3u8?token=${token}`
  };
};
