const { client } = require('../setup');
const logger = require('../logger');
const { gql } = require('@apollo/client/core');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

async function main() {
  let subscriptions = await getActiveAccounts();
  subscriptions.forEach(async (sub) => {
    if (!sub?.account?.id) {
      return;
    }
    let res = await fetch(sub.account.id, { starting_after: null });
    while (res?.has_more) {
      console.log({ starting_after: res.data[res.data.length - 1].id });
      res = await fetch(sub.account.id, {
        starting_after: res.data[res.data.length - 1].id
      });
    }
  });
}

main();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetch(account_id, { starting_after }) {
  sleep(200);
  let res = await stripe.payouts.list({
    limit: 100,
    expand: ['data.destination'],
    ...(starting_after ? { starting_after } : null)
  });
  let objects = res.data.map((pay) => {
    return {
      id: pay.id,
      data: pay,
      account_id
    };
  });
  await insertStripePayout(objects);
  return res;
}

async function getActiveAccounts() {
  try {
    let res = await client.query({
      query: gql`
        query getActiveAccounts {
          subscriptions(distinct_on: account_id) {
            account {
              id
              stripe_id
            }
          }
        }
      `
    });
    return res.data.subscriptions;
  } catch (e) {
    logger.error('Failed: getActiveAccounts', ref, e);
    throw e;
  }
}

async function insertStripePayout(objects) {
  try {
    let res = await client.mutate({
      variables: { objects },
      mutation: gql`
        mutation upsertStripePayouts(
          $objects: [stripe_payouts_insert_input!]!
        ) {
          insert_stripe_payouts(
            objects: $objects
            on_conflict: {
              constraint: stripe_payouts_pkey
              update_columns: data
            }
          ) {
            returning {
              id
            }
          }
        }
      `
    });
  } catch (e) {
    logger.error('Failed: insertStripePayout', objects, e);
    throw e;
  }
}
