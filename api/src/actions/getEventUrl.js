const logger = require('../logger');
const { getUser } = require('../lib');
const getEventUrl = require('../lib/getEventUrl');

module.exports = async function (req, res) {
  const user = getUser(req);
  const { id: event_id } = req.body.input;
  try {
    let result = await getEventUrl({ event_id, user });
    res.send(result);
  } catch (e) {
    logger.error(e.message, { event_id, user });
    res.status(500).send(e.message);
  }
};
