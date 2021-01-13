const dayjs = require('dayjs');
const logger = require('../logger');
const isBetween = require('dayjs/plugin/isBetween');
const { getEvent, getUserAccess } = require('../queries');
const { createToken, createPlaybackId } = require('../lib/mux');

dayjs.extend(isBetween);

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

  if (!data.event.mux_asset_id) {
    return { url: null };
  }

  if (
    data.event.price !== '$0.00' &&
    !event.account.users.find((u) => u.user.id === user.id) &&
    !user.isAdmin &&
    !data.eventAccess.length &&
    !data.accountAccess.length
  ) {
    return { url: null };
  }

  if (!dayjs().isBetween(data.event.start, data.event.end)) {
    logger.info('Current date is not within event window');
    return { url: null };
  }

  if (data.event.type === 'live' && !data.event.mux_livestream?.playback_ids) {
    logger.info('Live event does not have a playback id');
    return { url: null };
  }

  if (data.event.type === 'video' && !data.event.mux_asset_id) {
    logger.info('Video event does not have a mux asset id');
    return { url: null };
  }

  let playbackId;
  if (data.event.type === 'live') {
    playbackId = data?.event?.mux_livestream?.playback_ids[0];
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
