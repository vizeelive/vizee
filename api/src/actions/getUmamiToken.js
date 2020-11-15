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

  let { data } = await execute(GET_ACCOUNT_USERS, { account_id }, req.headers);

  data.accounts_by_pk.users.forEach(async (u) => {
    if (u.user.id === user.sub) {

      try {
        var { token: accessToken } = await fetch(
          `${process.env.UMAMI_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password: process.env.UMAMI_PASS,
            }),
          }
        ).then((res) => res.json());
      } catch (e) {
        console.error("Failed to authenticate admin with Umami");
        console.error(e);
      }

      return res.send({ accessToken });
    }
    res.send({ accessToken: "" });
  });
};
