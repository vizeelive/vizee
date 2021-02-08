const session = require('../../lib/session');
const logger = require('../../logger');

module.exports = async function (req, res) {
  const ref = req.query.ref;
  try {
    var sessionResult = await session({ ref });
    res.send(sessionResult);
  } catch (e) {
    res.status(500).send(e.message);
    logger.error(`Failed to create Stripe session: ${e.message}`, { ref });
    throw e;
  }
};;
