const fetch = require('node-fetch');
const { getUser } = require('../lib');
const logger = require('../logger');
const execute = require('../execute');

const { getAnonStripeCustomer, getUnlinkedUsers } = require('../queries');
const {
  updateUserStripeCustomerId,
  fixAnonAccess,
  linkAccountUser
} = require('../mutations');

/**
 * Links anonymous purchases and creator account invites
 *
 * @param {*} req
 * @param {*} res
 */
module.exports = async function hello(req, res) {
  const user = getUser(req);

  if (!user) {
    return res.status(200).send('OK');
  }

  try {
    let email = user.email;

    let stripe_customer_id = await getAnonStripeCustomer(email);
    if (stripe_customer_id) {
      await updateUserStripeCustomerId({
        user_id: user.id,
        stripe_customer_id
      });
    }

    await fixAnonAccess({ email, user_id: user.id });

    logger.info(`getUnlinkedUsers: ${email}`);
    let unlinkedUsers = await getUnlinkedUsers(email);

    await Promise.all(
      unlinkedUsers.map(async (u) => {
        logger.info(`linking`, { id: u.id, user_id: u.emailUser.id });
        return linkAccountUser({ id: u.id, user_id: u.emailUser.id });
      })
    );

    res.send({ message: 'Oh, hello!' });
  } catch (e) {
    console.log('Failed: hello', e, user);
  }
};
