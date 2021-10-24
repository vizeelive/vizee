const { client } = require('../../../setup');
const { gql } = require('@apollo/client/core');

async function account_updated(event) {
  try {
    let res = await client.mutate({
      variables: {
        id: event.data.object.id,
        data: event.data.object
      },
      mutation: gql`
        mutation UpdateStripeAccount($id: String!, $data: jsonb) {
          update_accounts(
            where: { stripe_id: { _eq: $id } }
            _set: { stripe_data: $data }
          ) {
            returning {
              id
            }
          }
        }
      `
    });
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

module.exports = account_updated;
