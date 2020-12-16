const app = require('../app');
const config = require('../config');
const { client } = require('../setup');
const bodyParser = require('body-parser');
const { gql } = require('@apollo/client');
const { subscribe, pay } = require('../lib/checkout');
const { generateImageLink } = require('../lib');

require('./index');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const connectEndpointSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

app.get('/stripe/account/create', async function (req, res) {
  let id = req.query.id;
  let username = req.query.username;

  const account = await stripe.accounts.create({
    type: 'express',
    settings: {
      payouts: {
        schedule: {
          interval: 'manual'
        }
      }
    }
  });

  try {
    await client.mutate({
      variables: {
        id,
        stripe_id: account.id
      },
      mutation: gql`
        mutation UpdateStripeId($id: uuid!, $stripe_id: String!) {
          update_accounts_by_pk(
            pk_columns: { id: $id }
            _set: { stripe_id: $stripe_id }
          ) {
            id
          }
        }
      `
    });
  } catch (e) {
    console.error(e);
  }

  const accountLinks = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${config.ui}/${username}/manage/dashboard`,
    return_url: `${config.ui}/${username}/manage/dashboard`,
    // refresh_url: `${config.ui}/${username}/manage/settings/${id}/payment/refresh`,
    // return_url: `${config.ui}/${username}/manage/settings/${id}/payment`,
    type: 'account_onboarding'
  });

  console.log({ account, accountLinks });
  res.send(accountLinks);
});

/**
 * Stripe Webhook
 */
app.post(
  '/stripe/connect/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        connectEndpointSecret
      );
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('/stripe/connect/webhook', { event });

    if (event.type === 'account.updated') {
      try {
        console.log('input', {
          id: event.data.object.id,
          data: event.data.object
        });
        await client.mutate({
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
      } catch (e) {
        console.error(e);
      }
    }

    res.json({ received: true });
  }
);
