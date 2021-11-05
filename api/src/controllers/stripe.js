const app = require('../app');
const logger = require('../logger');
const config = require('../config');
const { client } = require('../setup');
const bodyParser = require('body-parser');
const { gql } = require('@apollo/client/core');
const acccount_updated = require('./stripe/webhooks/account.updated.js');

const import_payouts = require('../jobs/import_payouts.js');
const import_subscriptions = require('../jobs/import_subscriptions.js');

require('./index');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

const connectEndpointSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;

app.post('/stripe/sync/subscriptions', async function (req, res) {
  await import_subscriptions();
  res.send();
});

app.get('/stripe/account/create', async function (req, res) {
  let id = req.query.id;
  let country = req.query.country;
  let username = req.query.username;
  let account_id = req.query.account_id;

  if (account_id === undefined) {
    logger.info('Creating new stripe account');
    var account = await stripe.accounts.create({
      type: 'express',
      country,
      capabilities: {
        transfers: {
          requested: true
        }
      },
      tos_acceptance: {
        service_agreement: 'recipient'
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'daily'
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
  } else {
    logger.info('Using existing stripe account');
  }

  const accountLinks = await stripe.accountLinks.create({
    account: account_id || account.id,
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

    if (event.type === 'account.updated') {
      await acccount_updated(event);
    }

    res.json({ received: true });
  }
);
