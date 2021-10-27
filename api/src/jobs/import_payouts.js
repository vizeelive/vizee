const { client } = require('../setup');
const logger = require('../logger');
const { gql } = require('@apollo/client/core');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

async function main() {
  async function fetch({ starting_after }) {
    let res = await stripe.payouts.list({
      limit: 100,
      expand: ['data.destination'],
      ...(starting_after ? { starting_after } : null)
    });
    let objects = res.data.map((pay) => {
      return {
        id: pay.id,
        data: pay
      };
    });
    await insertStripePayout(objects);
    return res;
  }
  let res = await fetch({ starting_after: null });
  while (res?.has_more) {
    console.log({ starting_after: res.data[res.data.length - 1].id });
    res = await fetch({ starting_after: res.data[res.data.length - 1].id });
  }
}

main();

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
