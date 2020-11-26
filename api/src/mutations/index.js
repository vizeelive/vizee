const { client } = require('../setup');
const { gql } = require('@apollo/client');

async function fixAnonTransactions({ email, user_id }) {
  try {
    await client.mutate({
      variables: {
        email,
        user_id
      },
      mutation: gql`
        mutation FixAnonTransactions($user_id: String!, $email: String!) {
          update_transactions(
            where: {
              _and: { email: { _eq: $email }, user_id: { _is_null: true } }
            }
            _set: { user_id: $user_id }
          ) {
            affected_rows
          }
        }
      `
    });
  } catch (e) {
    console.error('Faild: fixAnonTransactions', email, user_id, e);
    throw e;
  }
}

module.exports = { fixAnonTransactions };
