const { getUser } = require('../lib');
const execute = require('../execute');
const dayjs = require('dayjs');

const GET_STRIPE_URL_DATA = `
query getStripeUrlData($username: String!) {
  accounts(where: {username: {_eq: $username}}) {
    stripe_id
    users {
      user {
        id
      }
    }
  }
}
`;

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

module.exports = async function getStripeUrl(req, res) {
  const user = getUser(req);
  const { username } = req.body.input;

  user.id = user['https://hasura.io/jwt/claims']['x-hasura-user-id'];
  user.isAdmin = user['https://hasura.io/jwt/claims'][
    'x-hasura-allowed-roles'
  ].includes('admin');

  try {
    let { data } = await execute(
      GET_STRIPE_URL_DATA,
      { username },
      req.headers
    );

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
