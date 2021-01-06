const { getUser } = require('../lib');
const dayjs = require('dayjs');
const { getStripeUrlData } = require('../queries');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

module.exports = async function getStripeUrl(req, res) {
  const user = getUser(req);
  const { username } = req.body.input;

  try {
    let data = await getStripeUrlData(username);

    if (
      !user.isAdmin &&
      !data.accounts[0].users.filter((u) => u.user.id === user.id).length
    ) {
      console.log('Unauthorized', { user, data });
      return res.status(401).send('Unauthorized');
    }

    if (!data.accounts[0].stripe_id) {
      return res.send({ url: '' });
    }

    const loginLink = await stripe.accounts.createLoginLink(
      data.accounts[0].stripe_id
    );
    res.send({ url: loginLink.url });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};
