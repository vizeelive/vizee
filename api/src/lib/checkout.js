const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

async function findCustomer(email) {
  if (!email) return null;
  const customers = await stripe.customers.list({
    email: email.toLowerCase(),
    limit: 1
  });
  return customers.data.length ? customers.data[0].id : null;
}

/**
 * Creates a subscription
 *
 * @param {*} params
 */
async function subscribe(params) {
  const {
    ref,
    origin,
    account,
    event,
    product,
    unit_amount,
    image,
    email
  } = params;

  let customer = await findCustomer(email);

  return stripe.checkout.sessions.create(
    {
      mode: 'subscription',
      ...(customer ? { customer } : { customer_email: email }),
      client_reference_id: ref,
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            unit_amount,
            currency: 'usd',
            recurring: {
              interval: 'day',
              interval_count: product.access_length
            },
            product_data: {
              name: `${account.name} Subscription`,
              images: [image],
              metadata: {
                product_id: product.id
              }
            }
          }
        }
      ],
      success_url: `${origin}/${account.username}/${event.id}/success`,
      cancel_url: `${origin}/${account.username}/${event.id}/cancel`
    }
  );
}

/**
 * Purchases a single item
 *
 * @param {*} params
 */
async function pay(params) {
  const {
    ref,
    origin,
    account,
    event,
    amount,
    unit_amount,
    image,
    email
  } = params;

  let customer = await findCustomer(email);

  return stripe.checkout.sessions.create({
    mode: 'payment',
    ...(customer ? { customer } : { customer_email: email }),
    client_reference_id: ref,
    payment_method_types: ['card'],
    payment_intent_data: {
      setup_future_usage: 'off_session',
      transfer_data: {
        amount,
        destination: event.account.stripe_id
      }
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount,
          currency: 'usd',
          product_data: {
            name: `${event.name} - ${account.name}`,
            images: [image]
          }
        }
      }
    ],
    success_url: `${origin}/${account.username}/${event.id}/success`,
    cancel_url: `${origin}/${account.username}/${event.id}/cancel`
  });
}

module.exports = { subscribe, pay };
