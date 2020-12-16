const { parse } = require('zipson');
const dayjs = require('dayjs');
const { getUserAndProduct } = require('../../queries');

const {
  createAccess,
  updateAccessById,
  updateAccessByEmail,
  createTransaction,
  updateUserStripeCustomerId
} = require('../../mutations');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

module.exports = async function ({ event }) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log({ session });

    try {
      const customer = await stripe.customers.retrieve(
        event.data.object.customer
      );

      let ref = parse(session.client_reference_id);
      console.log({ ref });

      const { user, product, user_access } = await getUserAndProduct({
        email: customer.email,
        product_id: ref.product_id
      });

      // TODO if anon person bought product, and the access already exists, cancel the transaction

      let access;
      if (user && product.account_access) {
        access = user.access.find(
          (rec) => rec.account_id === product.account_id
        );
      } else if (user) {
        access = user.access.find((rec) => rec.event_id === ref.event_id);
      } else {
        access = user_access.find((rec) => rec.event_id === ref.event_id);
      }

      let currentExpiry;
      if (access) {
        currentExpiry = access.expiry;
      } else {
        currentExpiry = new Date();
      }

      let expiry = dayjs(currentExpiry)
        .add(product.access_length, 'day')
        .format('YYYY-MM-DD HH:mm:ss');

      let object = {
        expiry,

        ...(product.recurring
          ? { subscription: true }
          : { subscription: false }),

        ...(user && user.id ? { user_id: user.id } : { email: customer.email }),

        ...(product.account_access ? { account_id: product.account_id } : null),

        ...(!product.account_access ? { event_id: ref.event_id } : null),

        stripe_customer_id: session.customer,
        updated: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      if (!access) {
        createAccess({ object });
      } else {
        if (user) {
          updateAccessById({
            access_id: access.id,
            object
          });
        } else {
          updateAccessByEmail({
            email: customer.email,
            object
          });
        }
      }

      if (user) {
        await updateUserStripeCustomerId({
          user_id: user.id,
          stripe_customer_id: session.customer
        });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      if (product.recurring) {
        const subscription = await stripe.subscriptions.create({
          customer: session.customer,
          trial_period_days: product.access_length,
          items: [
            {
              price_data: {
                currency: 'usd',
                product: process.env.STRIPE_SUBSCRIPTION_PRODUCT,
                unit_amount: product.price.replace('$', '').replace('.', ''),
                recurring: {
                  interval: 'day',
                  interval_count: product.access_length
                }
              }
            }
          ],
          // expand: ['latest_invoice.payment_intent'],
          default_payment_method: paymentIntent.payment_method,
          transfer_data: {
            destination: product.account.stripe_id
          }
        });
      }

      await createTransaction({ customer, ref, user, session });
    } catch (e) {
      console.error(e);
      throw e.message;
    }
  }
};
