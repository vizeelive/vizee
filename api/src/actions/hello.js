const fetch = require('node-fetch');
const { getUser } = require('../lib');
const execute = require('../execute');

const { getAnonStripeCustomer } = require('../queries');
const { updateUserStripeCustomerId, fixAnonAccess } = require('../mutations');

/**
 * Finds anonymous purchases via email and updates the user and
 * stripe_customer_id with the correct user
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
    let user_id = user['https://hasura.io/jwt/claims']['x-hasura-user-id'];

    let stripe_customer_id = await getAnonStripeCustomer(email);
    if (stripe_customer_id) {
      await updateUserStripeCustomerId({ user_id, stripe_customer_id });
    }

    await fixAnonAccess({ email, user_id });

    res.send({ message: 'Oh, hello!' });
  } catch (e) {
    console.log('Failed: hello', e, user);
  }
};
