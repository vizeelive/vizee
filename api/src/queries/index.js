const { client } = require('../setup');
const { gql } = require('@apollo/client');

/**
 * Fetch event and account to be used by Stripe Session
 *
 * @param {object} ref
 */
async function getEventAndAccount(ref) {
  try {
    let res = await client.query({
      variables: {
        id: ref.event_id,
        account_id: ref.account_id
      },
      query: gql`
        query MyQuery($id: uuid!, $account_id: uuid!) {
          events_by_pk(id: $id) {
            id
            name
            price
            photo
            start
            account {
              stripe_id
            }
          }
          accounts_by_pk(id: $account_id) {
            name
            photo
            username
            fee_percent
            subscription_rate
            domain
          }
        }
      `
    });
    return { event: res.data.events_by_pk, account: res.data.accounts_by_pk };
  } catch (e) {
    console.log('Failed: getEventAndAccount', ref, e);
    throw e;
  }
}

/**
 * Finds a user given an email
 *
 * @param {string} email
 */
async function getUserByEmail(email) {
  try {
    let res = await client.query({
      variables: { email },
      query: gql`
        query GetUserByEmail($email: String!) {
          users(where: { email: { _eq: $email } }) {
            id
          }
        }
      `
    });
    return res.data.users[0];
  } catch (e) {
    console.log('Failed: getUserByEmail', email, e);
    throw e;
  }
}

module.exports = { getEventAndAccount, getUserByEmail };
