const config = require('../config');
const { getUser } = require('../lib');
const execute = require('../execute');
const dayjs = require('dayjs');

const GET_STRIPE_CUSTOMER_ID = `
query getStripeCustomerId($user_id: uuid!) {
  users_by_pk(id: $user_id) {
    stripe_customer_id
  }
}
`;

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

module.exports = async function getStripeUrl(req, res) {
  const user = getUser(req);

  try {
    let { data } = await execute(
      GET_STRIPE_CUSTOMER_ID,
      { user_id: user.id },
      req.headers
    );

    if (!data.users_by_pk.stripe_customer_id) {
      return res.send({ url: '' });
    }

    const portalsession = await stripe.billingPortal.sessions.create({
      customer: data.users_by_pk.stripe_customer_id,
      return_url: config.ui
    });

    res.send({ url: portalsession.url });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
};
