const fetch = require('node-fetch');
const { getUser } = require('../lib');
const execute = require('../execute');

const GET_ACCOUNT_USERS = `
query GetAccountUsers($account_id: uuid!) {
  accounts_by_pk(id: $account_id) {
    umami_username
    users {
      user {
        id
      }
    }
  }
}
`;

module.exports = async function getUmamiToken(req, res) {
  const user = getUser(req);
  const { account_id } = req.body.input;

  let { data } = await execute(GET_ACCOUNT_USERS, { account_id }, req.headers);
  console.log({ user });
  console.log(data.accounts_by_pk.users);

  data.accounts_by_pk.users.forEach(async (u) => {
    if (
      user.isAdmin ||
      u.user.id === user['https://hasura.io/jwt/claims']['x-hasura-user-id']
    ) {
      try {
        var { token: accessToken } = await fetch(
          `${process.env.UMAMI_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: data.accounts_by_pk.umami_username,
              password: process.env.UMAMI_PASS
            })
          }
        ).then((res) => {
          console.log(res.body);
          return res.json();
        });
      } catch (e) {
        console.log('Failed to authenticate admin with Umami');
        console.log(e);
      }

      return res.send({ accessToken });
    }
    res.send({ accessToken: '' });
  });
};
