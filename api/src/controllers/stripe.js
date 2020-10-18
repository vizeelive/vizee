const app = require('../app');
const config = require('../config');
const { client } = require('../setup');
const bodyParser = require('body-parser');
const { gql } = require('@apollo/client');
const atob = require('atob');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const connectEndpointSecret = process.env.STRIPE_CONNET_WEBHOOK_SECRET;

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
    refresh_url: `${config.ui}/${username}/settings/${id}/payment/refresh`,
    return_url: `${config.ui}/${username}/settings/${id}/payment`,
    type: 'account_onboarding'
  });

  console.log({ account, accountLinks });
  res.send(accountLinks);
});

/**
 * Stripe Session
 */
app.get('/stripe/session', async function (req, res) {
  let ref = JSON.parse(atob(req.query.ref));

  let event;
  try {
    event = await client.query({
      variables: {
        id: ref.event_id
      },
      query: gql`
        query MyQuery($id: uuid!) {
          events_by_pk(id: $id) {
            id
            price
            account {
              stripe_id
            }
          }
        }
      `
    });
  } catch (e) {
    console.log('Failed to fetch event');
    console.log(e);
    console.log({
      variables: {
        id: ref.event_id
      },
      query: gql`
        query MyQuery($id: uuid!) {
          events_by_pk(id: $id) {
            id
            price
          }
        }
      `
    });
  }

  console.log({ event });

  const session = await stripe.checkout.sessions.create({
    client_reference_id: req.query.ref,
    payment_method_types: ['card'],
    payment_intent_data: {
      application_fee_amount: 100,
      transfer_data: {
        destination: event.data.events_by_pk.account.stripe_id
      }
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Admission',
            images: [
              'https://i.pinimg.com/originals/b8/cd/45/b8cd45d0ad0ef3d756515dedfdd537a2.jpg'
            ]
          },
          unit_amount: parseInt(
            event.data.events_by_pk.price.replace('$', '').replace('.', '')
          ) // FIXME create a real product
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${config.ui}/events/${event.data.events_by_pk.id}`,
    cancel_url: `${config.ui}/events/${event.data.events_by_pk.id}`
  });
  console.log({ session });
  res.send(session);
});

/**
 * Stripe Webhook
 */
app.post(
  '/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log({ event });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      let ref = JSON.parse(atob(session.client_reference_id));

      try {
        await client.mutate({
          variables: {
            object: {
              event_id: ref.event_id,
              user_id: ref.user_id,
              price: session.amount_total / 100
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
        console.error(e);
      }
    }

    response.json({ received: true });
  }
);

/**
 * Stripe Webhook
 */
app.post(
  '/stripe/connect/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        connectEndpointSecret
      );
    } catch (err) {
      console.log(err);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log({ event });

    if (event.type === 'account.updated') {
      try {
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

    response.json({ received: true });
  }
);
