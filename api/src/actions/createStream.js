const logger = require('../logger')(module);
const { getUser } = require('../lib');
const { createStream } = require('../lib/mux');
const { getEvent } = require('../queries');
const { updateMuxLivestream } = require('../mutations');

module.exports = async function (req, res) {
  const user = getUser(req);
  const { event_id } = req.body.input;
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

    if (event.mux_livestream) {
      logger.info('Sending existing stream key');
      return res.send({ stream_key: event.mux_livestream.stream_key });
    }

    logger.info('Creating new steam');
    let result = await createStream();

    logger.info('Updating livestream data');
    await updateMuxLivestream({
      id: event_id,
      mux_id: result.id,
      data: result
    });

    res.send({ stream_key: result.stream_key });
  } catch (e) {
    logger.error(e.message, { event_id, user });
    res.status(400).send({ message: e.message });
    throw e;
  }
};
