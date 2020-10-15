require('dotenv').config();
const config = require('./config');
const fetch = require('cross-fetch');
const express = require('express');
const app = express();
const cors = require('cors');
const atob = require('atob');
const bodyParser = require('body-parser');
const { setContext } = require('@apollo/link-context');

const actions = require('./actions');

app.use(cors({ origin: '*' }));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql
} = require('@apollo/client');

const httpLink = createHttpLink({
  uri: config.api,
  fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
    }
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

const port = 3001;

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Hasura Actions interceptor
 */
app.post(
  '/',
  bodyParser.json({ type: 'application/json' }),
  async (req, res) => {
    let action = req.body.action.name;
    return actions[action](req, res);
  }
);

/**
 * Stripe Session
 */
app.get('/session', async function (req, res) {
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

  const session = await stripe.checkout.sessions.create({
    client_reference_id: req.query.ref,
    payment_method_types: ['card'],
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
  '/webhook',
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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      let ref = JSON.parse(atob(session.client_reference_id));

      try {
        let result = await client.mutate({
          variables: {
            object: {
              event_id: ref.event_id,
              user_id: ref.user_id,
              price: session.amount_total / 100
            }
          },
          mutation: gql`
            mutation MyMutation($object: transactions_insert_input!) {
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

app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
