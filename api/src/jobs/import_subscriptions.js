const { client } = require('../setup');
const logger = require('../logger');
const { gql } = require('@apollo/client/core');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

const import_payouts = require('./import_payouts');

async function main() {
  async function fetch({ starting_after }) {
    let res = await stripe.subscriptions.list({
      limit: 100,
      ...(starting_after ? { starting_after } : null)
    });
    let objects = res.data.map((sub) => {
      return {
        id: sub.id,
        data: sub
      };
    });
    await insertStripeSubscription(objects);
    return res;
  }
  let res = await fetch({ starting_after: null });
  while (res?.has_more) {
    res = await fetch({ starting_after: res.data[res.data.length - 1].id });
  }
}

main();

async function insertStripeSubscription(objects) {
  try {
    let res = await client.mutate({
      variables: { objects },
      mutation: gql`
        mutation upsertStripeSubscriptions(
          $objects: [stripe_subscriptions_insert_input!]!
        ) {
          insert_stripe_subscriptions(
            objects: $objects
            on_conflict: {
              constraint: stripe_subscriptions_pkey
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
    await import_payouts();
  } catch (e) {
    logger.error('Failed: insertStripeSubscription', objects, e);
    throw e;
  }
}

module.exports = main;
