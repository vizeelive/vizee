const { client } = require('../setup');
const { gql } = require('@apollo/client');

/**
 * Fetch event and account to be used by Stripe Session
 *
 * @param {object} ref
 */
async function getCheckoutData(ref) {
  try {
    let res = await client.query({
      variables: {
        id: ref.event_id,
        account_id: ref.account_id,
        product_id: ref.product_id
      },
      query: gql`
        query getCheckoutData($id: uuid!, $product_id: uuid!) {
          events_by_pk(id: $id) {
            id
            name
            price
            photo
            start
            account {
              name
              photo
              username
              fee_percent
              domain
              stripe_id
            }
          }
          products_by_pk(id: $product_id) {
            id
            name
            price
            recurring
            account_id
            access_length
            events {
              id
            }
          }
        }
      `
    });
    return {
      event: res.data.events_by_pk,
      account: res.data.events_by_pk.account,
      product: res.data.products_by_pk
    };
  } catch (e) {
    console.log('Failed: getEventAndAccount', ref, e);
    throw e;
  }
}

async function getEvent(id) {
  try {
    let res = await client.query({
      variables: { id },
      query: gql`
        query getEvent($id: uuid!) {
          events_by_pk(id: $id) {
            account_id
          }
        }
      `
    });
    return res.data.events_by_pk;
  } catch (e) {
    console.log('Failed: getEvent', id);
    throw e;
  }
}

async function getAnonStripeCustomer(email) {
  try {
    let res = await client.query({
      variables: { email },
      query: gql`
        query getAnonStripeCustomer($email: String!) {
          users_access(
            where: { email: { _eq: $email }, user_id: { _is_null: true } }
          ) {
            stripe_customer_id
          }
        }
      `
    });
    return res.data.users_access.length
      ? res.data.users_access[0].stripe_customer_id
      : null;
  } catch (e) {
    console.log('Failed: getAnonStripeCustomer', email);
    throw e;
  }
}

/**
 * Finds a user given an email, and gets the product
 *
 * @param {string} email
 */
async function getUserAndProduct({ email, product_id }) {
  try {
    let res = await client.query({
      variables: { email, product_id },
      query: gql`
        query getUserAndProduct($email: String!, $product_id: uuid!) {
          users(where: { email: { _eq: $email } }) {
            id
            access {
              id
              expiry
              event_id
              account_id
            }
          }
          products_by_pk(id: $product_id) {
            price
            account_id
            account_access
            recurring
            access_length
            account {
              stripe_id
            }
            events {
              id
              event {
                account {
                  id
                }
              }
            }
          }
          users_access(where: { email: { _eq: $email } }) {
            id
            event_id
            account_id
            expiry
          }
        }
      `
    });
    return {
      user: res.data.users[0],
      product: res.data.products_by_pk,
      user_access: res.data.users_access
    };
  } catch (e) {
    console.log('Failed: getUserAndProduct', email, product_id, e);
    throw e;
  }
}

async function subscriptionPrecheck(variables) {
  try {
    let res = await client.query({
      variables,
      query: gql`
        query subscriptionPrecheck(
          $email: String
          $user_id: uuid!
          $event_id: uuid
          $account_id: uuid
          $expiry: timestamptz!
        ) {
          eventSubscriptionByEmail: users_access(
            where: {
              email: { _eq: $email }
              expiry: { _gt: $expiry }
              subscription: { _eq: true }
              event_id: { _eq: $event_id }
            }
          ) {
            id
          }
          eventSubscriptionById: users_access(
            where: {
              user_id: { _eq: $user_id }
              expiry: { _gt: $expiry }
              subscription: { _eq: true }
              event_id: { _eq: $event_id }
            }
          ) {
            id
          }
          accountSubscriptionByEmail: users_access(
            where: {
              email: { _eq: $email }
              expiry: { _gt: $expiry }
              subscription: { _eq: true }
              account_id: { _eq: $account_id }
            }
          ) {
            id
          }
          accountSubscriptionById: users_access(
            where: {
              user_id: { _eq: $user_id }
              expiry: { _gt: $expiry }
              subscription: { _eq: true }
              account_id: { _eq: $account_id }
            }
          ) {
            id
          }
        }
      `
    });
    return res.data;
  } catch (e) {
    console.log('Failed: subscriptionPrecheck', email, event_product_id, e);
    throw e;
  }
}

module.exports = {
  getEvent,
  getAnonStripeCustomer,
  getCheckoutData,
  getUserAndProduct,
  subscriptionPrecheck
};
