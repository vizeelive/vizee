const logger = require('../logger');
const { client } = require('../setup');
const { gql } = require('@apollo/client/core');

async function getCheckoutData(ref) {
  try {
    let res = await client.query({
      variables: {
        affiliate_id: ref.affiliate,
        account_id: ref.account_id,
        product_id: ref.product_id,
        event_id: ref.event_id,
        has_affiliate: !!ref.affiliate,
        has_account: !!ref.account_id,
        has_product: !!ref.product_id,
        has_event: !!ref.event_id
      },
      query: gql`
        query getCheckoutData(
          $affiliate_id: uuid
          $event_id: uuid
          $account_id: uuid
          $product_id: uuid
          $has_affiliate: Boolean!
          $has_event: Boolean!
          $has_product: Boolean!
          $has_account: Boolean!
        ) {
          events(where: { id: { _eq: $event_id } }, limit: 1)
            @include(if: $has_event) {
            id
            name
            price
            photo
            start
            account {
              id
              name
              photo
              username
              fee_percent
              domain
              stripe_id
            }
          }
          users(where: { id: { _eq: $affiliate_id } }, limit: 1)
            @include(if: $has_affiliate) {
            payout_account_id
            affiliate_account {
              stripe_id
            }
          }
          accounts(where: { id: { _eq: $account_id } }, limit: 1)
            @include(if: $has_account) {
            id
            name
            username
            photo
            fee_percent
            affiliate_commission
            stripe_id
          }
          products(where: { id: { _eq: $product_id } }, limit: 1)
            @include(if: $has_product) {
            id
            name
            price
            account_access
            recurring
            account_id
            access_length
            events {
              id
            }
            account {
              id
              name
              username
              photo
              fee_percent
              affiliate_commission
              stripe_id
            }
          }
        }
      `
    });
    return {
      account:
        res.data?.accounts?.[0] ||
        res.data?.events?.[0]?.account ||
        res.data?.products?.[0]?.account,
      event: res.data?.events?.[0],
      product: res.data?.products?.[0],
      affiliate: res.data?.users?.[0]
    };
  } catch (e) {
    logger.error('Failed: getCheckoutData', ref, e);
    throw e;
  }
}

async function getUserId({ email }) {
  try {
    let res = await client.query({
      variables: {
        email
      },
      query: gql`
        query GetUserId($email: String!) {
          users(where: { email: { _eq: $email } }) {
            id
            code
          }
        }
      `
    });
    return res.data.users[0];
  } catch (e) {
    logger.error('Failed: getUserId', email, e);
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
            id
            status
            video
            stream_type
            mux_livestream
            account_id
            account {
              id
              users(where: { user_id: { _is_null: false } }) {
                user {
                  id
                }
              }
            }
          }
        }
      `
    });
    return res.data.events_by_pk;
  } catch (e) {
    logger.error('Failed: getEvent', { id });
    throw e;
  }
}

async function getAccount(params) {
  const { account_id } = params;
  try {
    let res = await client.query({
      variables: { account_id },
      query: gql`
        query getAccount($account_id: uuid!) {
          accounts_by_pk(id: $account_id) {
            id
            name
            mattermost_channel_id
            users {
              user {
                id
              }
            }
          }
        }
      `
    });
    return {
      account: res.data.accounts_by_pk
    };
  } catch (e) {
    logger.error('Failed: getAccount', params);
    throw e;
  }
}

async function getAccountAndProduct(params) {
  const { product_id } = params;
  try {
    let res = await client.query({
      variables: { product_id },
      query: gql`
        query getAccountAndProduct($product_id: uuid!) {
          products_by_pk(id: $product_id) {
            id
            stripe_product_id
            account {
              id
              name
              users {
                user {
                  id
                }
              }
            }
          }
        }
      `
    });
    return {
      account: res.data.products_by_pk.account,
      product: res.data.products_by_pk
    };
  } catch (e) {
    logger.error('Failed: getAccountAndProduct', params);
    throw e;
  }
}

async function getStripeUrlData(username) {
  try {
    let res = await client.query({
      variables: { username },
      query: gql`
        query getStripeUrlData($username: String!) {
          accounts(where: { username: { _eq: $username } }) {
            id
            stripe_id
            users(where: { user_id: { _is_null: false } }) {
              id
              user {
                id
              }
            }
          }
        }
      `
    });
    return res.data;
  } catch (e) {
    logger.error('Failed: getStripeUrlData', username);
    throw e;
  }
}

async function getUserAccess(params) {
  let { user_id, event_id, account_id, expiry } = params;
  try {
    let res = await client.query({
      variables: { user_id, event_id, account_id, expiry },
      query: gql`
        query getUserAccess(
          $user_id: uuid
          $expiry: timestamptz!
          $account_id: uuid!
          $event_id: uuid!
        ) {
          event: events_by_pk(id: $event_id) {
            id
            price
            type
            start
            end
            published
            stream_type
            mux_livestream
            mux_asset_id
          }
          eventAccess: users_access(
            where: {
              event_id: { _eq: $event_id }
              user_id: { _eq: $user_id }
              expiry: { _gt: $expiry }
            }
          ) {
            id
            product {
              download_access
            }
          }
          accountAccess: users_access(
            where: {
              account_id: { _eq: $account_id }
              user_id: { _eq: $user_id }
              expiry: { _gt: $expiry }
            }
          ) {
            id
            product {
              download_access
            }
          }
        }
      `
    });
    return res.data;
  } catch (e) {
    logger.error('Failed: getUserAccess', params);
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
    logger.error('Failed: getAnonStripeCustomer', email);
    throw e;
  }
}

async function getUnlinkedUsers(email) {
  try {
    let res = await client.query({
      variables: { email },
      query: gql`
        query getUnlinkedUsers($email: String!) {
          accounts_users(where: { email: { _eq: $email } }) {
            id
            emailUser {
              id
            }
          }
        }
      `
    });
    return res.data.accounts_users;
  } catch (e) {
    logger.error('Failed: getUnlinkedUsers', email);
    throw e;
  }
}

async function getUnlinkedAffiliates(email) {
  try {
    let res = await client.query({
      variables: { email },
      query: gql`
        query getUnlinkedAffiliates($email: String!) {
          accounts_affiliates(where: { email: { _eq: $email } }) {
            id
            emailUser {
              id
            }
          }
        }
      `
    });
    return res.data.accounts_affiliates;
  } catch (e) {
    logger.error('Failed: getUnlinkedUsers', email);
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
            id
            price
            account_id
            account_access
            recurring
            access_length
            stripe_product_id
            account {
              id
              fee_percent
              stripe_id
            }
            events {
              id
              event {
                id
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
    logger.error('Failed: getUserAndProduct', email, product_id, e);
    throw e;
  }
}

/**
 * Finds a user given an email
 *
 * @param {string} email
 */
async function getUser({ email }) {
  try {
    let res = await client.query({
      variables: { email },
      query: gql`
        query getUser($email: String!) {
          users(where: { email: { _eq: $email } }) {
            id
            access {
              id
              expiry
              event_id
              account_id
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
      user_access: res.data.users_access
    };
  } catch (e) {
    logger.error('Failed: getUser', email, e);
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
    logger.error('Failed: subscriptionPrecheck', email, event_product_id, e);
    throw e;
  }
}

module.exports = {
  getEvent,
  getUser,
  getAnonStripeCustomer,
  getUserAndProduct,
  subscriptionPrecheck,
  getUserAccess,
  getUnlinkedUsers,
  getUnlinkedAffiliates,
  getStripeUrlData,
  getAccountAndProduct,
  getAccount,
  getCheckoutData,
  getUserId
};
