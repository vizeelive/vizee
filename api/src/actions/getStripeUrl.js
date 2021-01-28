const { getUser } = require('../lib');
const dayjs = require('dayjs');
const { getStripeUrlData } = require('../queries');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

module.exports = async function getStripeUrl(req, res) {
  const defaultResponse = { url: '' };
  const user = getUser(req);
  const { username } = req.body.input;

  try {
    var data = await getStripeUrlData(username);

    if (
      !user.isAdmin &&
      !data.accounts[0].users.filter((u) => u.user.id === user.id).length
    ) {
      console.log('getStripeUrl: Unauthorized', JSON.stringify({ user, data }));
      return res.send(defaultResponse);
    }

    if (!data.accounts[0].stripe_id) {
      console.log(
        'getStripeUrl: could not find stripe_id',
        JSON.stringify({ user, username, data })
      );
      return res.send(defaultResponse);
    }

    const loginLink = await stripe.accounts.createLoginLink(
      data.accounts[0].stripe_id
    );
    res.send({ url: loginLink.url });
  } catch (e) {
    console.log(
      'getStripeUrl: Unauthorized',
      e,
      JSON.stringify({ user, username, data })
    );
    return res.send(defaultResponse);
  }
};
