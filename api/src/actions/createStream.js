const logger = require('../logger');
const { getUser } = require('../lib');
const { createChannel } = require('../lib/aws');
const { createStream } = require('../lib/mux');
const { getEvent } = require('../queries');
const { updateMuxLivestream } = require('../mutations');

module.exports = async function (req, res) {
  const user = getUser(req);
  const { type, event_id } = req.body.input;
  logger.info('Creating stream', { type, event_id });
  try {
    if (!user) {
      throw new Error('Unauthorized: no user found');
    }

    logger.info('Fetching event');
    let event = await getEvent(event_id);

    logger.info('Checking for access');
    if (
      !user.isAdmin &&
      !event.account.users.find((u) => u.user.id === user.id)
    ) {
      throw new Error('Unauthorized: no access');
    }

    if (
      event.stream_type == 'mux' &&
      event.status !== 'completed' &&
      event.mux_livestream
    ) {
      logger.info('Sending existing mux stream key');
      return res.send({
        stream_key: {
          url: 'rtmp://stream.vizee.live:5222/app',
          key: event.mux_livestream.stream_key
        }
      });
    }

    if (
      event.stream_type.includes('ivs') &&
      event.status !== 'completed' &&
      event.mux_livestream
    ) {
      logger.info('Sending existing ivs stream key');
      return res.send({
        stream_key: {
          url: `rtmps://${event.mux_livestream.channel.ingestEndpoint}`,
          key: event.mux_livestream.streamKey.value
        }
      });
    }

    logger.info('Creating new steam');

    switch (type) {
      case 'ivs_fast':
        var result = await createChannel({ event });
        var ivs_channel_arn = result.streamKey.channelArn;
        var data = { channel: result.channel, streamKey: result.streamKey };
        var key = {
          url: `rtmps://${result.channel.ingestEndpoint}`,
          key: result.streamKey.value
        };
        break;
      case 'mux':
        var ivs_channel_arn = null;
        var data = await createStream();
        var key = {
          url: 'rtmp://stream.vizee.live:5222/app',
          key: data.stream_key
        };
        break;
    }

    logger.info('Updating livestream data', { data });

    await updateMuxLivestream({
      id: event_id,
      stream_type: type,
      mux_id: data.id,
      ivs_channel_arn,
      data
    });

    res.send({ stream_key: key });
  } catch (e) {
    logger.error(e.message, { event_id, user });
    res.status(400).send({ message: e.message });
    throw e;
  }
};
