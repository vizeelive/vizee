const stripe = require('./stripe');

/**
 * Creates a subscription
 *
 * @param {*} params
 */
// async function subscribe(params) {
//   const {
//     ref,
//     origin,
//     account,
//     event,
//     product,
//     unit_amount,
//     image,
//     email
//   } = params;

//   let customer = await stripe.findCustomer(email);

//   return stripe.createSession({
//     mode: 'subscription',
//     ...(customer ? { customer } : { customer_email: email }),
//     client_reference_id: ref,
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         quantity: 1,
//         price_data: {
//           unit_amount,
//           currency: 'usd',
//           recurring: {
//             interval: 'day',
//             interval_count: product.access_length
//           },
//           product_data: {
//             name: `${account.name} Subscription`,
//             images: [image],
//             metadata: {
//               product_id: product.id
//             }
//           }
//         }
//       }
//     ],
//     success_url: `${origin}/${account.username}/${event.id}/success`,
//     cancel_url: `${origin}/${account.username}/${event.id}/cancel`
//   });
// }

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

  let customer = await stripe.findCustomer(email);

  return stripe.createSession({
    mode: 'payment',
    ...(customer ? { customer } : { customer_email: email }),
    client_reference_id: ref,
    payment_method_types: ['card'],
    payment_intent_data: {
      setup_future_usage: 'off_session',
      transfer_data: {
        amount,
        destination: account.stripe_id
      }
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          unit_amount,
          currency: 'usd',
          product_data: {
            name: event ? `${event.name} - ${account.name}` : `${account.name}`,
            images: [image]
          }
        }
      }
    ],
    success_url: event
      ? `${origin}/${account.username}/${event.id}/success`
      : `${origin}/${account.username}/success`,
    cancel_url: event
      ? `${origin}/${account.username}/${event.id}/cancel`
      : `${origin}/${account.username}/cancel`
  });
}

module.exports = { pay };
