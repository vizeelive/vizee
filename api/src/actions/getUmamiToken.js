const fetch = require("node-fetch");
const jwt_decode = require("jwt-decode");
const execute = require("../execute");

const GET_ACCOUNT_USERS = `
query GetAccountUsers($account_id: uuid!) {
  accounts_by_pk(id: $account_id) {
    users {
      user {
        id
      }
    }
  }
}
`;

module.exports = async function getUmamiToken(req, res) {
  const token = req.headers.authorization.replace("Bearer ", "");
  const { account_id, username } = req.body.input;
  const user = jwt_decode(token);

  user.isAdmin = user['https://hasura.io/jwt/claims'][
    'x-hasura-allowed-roles'
  ].includes('admin');

  let { data } = await execute(GET_ACCOUNT_USERS, { account_id }, req.headers);

  data.accounts_by_pk.users.forEach(async (u) => {
    if (user.isAdmin || u.user.id === user.sub) {
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
              username,
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
    res.send({ accessToken: "" });
  });
};
