const logger = require('../../logger');
const { parse } = require('zipson');
const dayjs = require('dayjs');

const stripe = require('../../lib/stripe');

const { getUser, getUserAndProduct } = require('../../queries');

const {
  createAccess,
  updateAccessById,
  updateAccessByEmail,
  createTransaction,
  updateUserStripeCustomerId
} = require('../../mutations');

module.exports = async function ({ event }) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const customer = await stripe.getCustomer(event.data.object.customer);

      let ref = parse(session.client_reference_id);
      logger.debug('ref', { ref });

      if (ref.isTip) {
        return;
      }

      if (ref.product_id) {
        logger.info('Fetching user and product');
        var { user, product, user_access } = await getUserAndProduct({
          email: customer.email,
          product_id: ref.product_id
        });
      } else {
        logger.info('Fetching user for permanent event access');
        var product = {
          id: null,
          account_access: false,
          recurring: false,
          access_length: null
        };
        var { user, user_access } = await getUser({
          email: customer.email
        });
      }

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

      let expiry;
      if (product.access_length) {
        expiry = dayjs(currentExpiry)
          .add(product.access_length, 'day')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        expiry = dayjs('2061-03-16').format('YYYY-MM-DD HH:mm:ss');
      }

      if (user) {
        await updateUserStripeCustomerId({
          user_id: user.id,
          stripe_customer_id: session.customer
        });
      }

      const paymentIntent = await stripe.getPaymentIntent(
        session.payment_intent
      );

      var subscription;
      if (product.recurring) {
        subscription = await stripe.createSubscription({
          customer: session.customer,
          trial_period_days: product.access_length,
          items: [
            {
              price_data: {
                currency: 'usd',
                product: product.stripe_product_id,
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
            amount_percent: 100 - product.account.fee_percent - 3,
            destination: product.account.stripe_id
          }
        });
      }

      let object = {
        expiry,

        ...(product.recurring
          ? { subscription: true }
          : { subscription: false }),

        ...(user && user.id ? { user_id: user.id } : { email: customer.email }),

        ...(product.account_access ? { account_id: product.account_id } : null),

        ...(product.id ? { product_id: product.id } : null),

        ...(!product.account_access ? { event_id: ref.event_id } : null),

        ...(product.recurring
          ? { stripe_subscription_id: subscription.id }
          : null),

        stripe_customer_id: session.customer,
        updated: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      if (!access) {
        logger.info('No access, creating.');
        createAccess({ object });
      } else {
        if (user) {
          logger.info('Found user, updating access');
          updateAccessById({
            access_id: access.id,
            object
          });
        } else {
          logger.info('Creating access with email');
          updateAccessByEmail({
            email: customer.email,
            object
          });
        }
      }

      await createTransaction({
        customer,
        ref,
        user,
        product,
        session,
        affiliate_id: ref?.affiliate
      });
    } catch (e) {
      logger.error(`checkout.session.completed: ${e.message}`);
      throw e.message;
    }
  }
};
