const { client } = require('../setup');
const { gql } = require('@apollo/client');

async function updateUserStripeCustomerId(params) {
  let { user_id, stripe_customer_id } = params;
  try {
    await client.mutate({
      variables: {
        user_id,
        stripe_customer_id
      },
      mutation: gql`
        mutation updateUserStripeCustomerId(
          $user_id: uuid!
          $stripe_customer_id: String!
        ) {
          update_users_by_pk(
            pk_columns: { id: $user_id }
            _set: { stripe_customer_id: $stripe_customer_id }
          ) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: updateUserStripeCustomerId', params, e);
    throw e;
  }
}

async function fixAnonTransactions({ email, user_id }) {
  try {
    await client.mutate({
      variables: {
        email,
        user_id
      },
      mutation: gql`
        mutation FixAnonTransactions($user_id: uuid!, $email: String!) {
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
    console.error('Failed: fixAnonTransactions', email, user_id, e);
    throw e;
  }
}

async function linkAccountUser({ id, user_id }) {
  try {
    await client.mutate({
      variables: {
        id,
        user_id
      },
      mutation: gql`
        mutation linkAccountUser($id: uuid!, $user_id: uuid!) {
          update_accounts_users_by_pk(
            pk_columns: { id: $id }
            _set: { user_id: $user_id }
          ) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: linkAccountUser', id, user_id, e);
    throw e;
  }
}

async function fixAnonAccess({ email, user_id }) {
  try {
    await client.mutate({
      variables: {
        email,
        user_id
      },
      mutation: gql`
        mutation fixAnonAccess($email: String!, $user_id: uuid!) {
          update_users_access(
            where: { user_id: { _is_null: true }, email: { _eq: $email } }
            _set: { user_id: $user_id }
          ) {
            affected_rows
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: fixAnonAccess', email, user_id, e);
    throw e;
  }
}

async function updateAccessById({ access_id, object }) {
  try {
    await client.mutate({
      variables: { access_id, object },
      mutation: gql`
        mutation updateAccessById(
          $access_id: uuid!
          $object: users_access_set_input!
        ) {
          update_users_access_by_pk(
            pk_columns: { id: $access_id }
            _set: $object
          ) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: updateAccessById', access_id, object);
    throw e;
  }
}

async function updateAccessByEmail({ email, object }) {
  try {
    await client.mutate({
      variables: { email, object },
      mutation: gql`
        mutation updateAccessByEmail(
          $email: String!
          $object: users_access_set_input!
        ) {
          update_users_access(
            _set: $object
            where: { email: { _eq: $email } }
          ) {
            affected_rows
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: updateAccessByEmail', email, object);
    throw e;
  }
}

async function createAccess({ object }) {
  try {
    await client.mutate({
      variables: { object },
      mutation: gql`
        mutation createUserAccess($object: users_access_insert_input!) {
          insert_users_access_one(object: $object) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: createAccess', object);
    throw e;
  }
}

async function createTransaction(params) {
  const { customer, ref, user, session } = params;

  try {
    return client.mutate({
      variables: {
        object: {
          email: customer.email,
          event_id: ref.event_id,
          ...(user && user.id ? { user_id: user.id } : null),
          price: session.amount_total / 100,
          ref: session.payment_intent
        }
      },
      mutation: gql`
        mutation InsertTransaction($object: transactions_insert_input!) {
          insert_transactions_one(object: $object) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error('Failed: createTransaction', params);
    throw e;
  }
}

module.exports = {
  fixAnonTransactions,
  fixAnonAccess,
  createAccess,
  updateAccessById,
  updateAccessByEmail,
  createTransaction,
  updateUserStripeCustomerId,
  linkAccountUser
};
