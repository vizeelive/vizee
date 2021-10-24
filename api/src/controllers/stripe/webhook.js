const logger = require('../../logger');
const invoice_paid = require('./webhooks/invoice.paid');
const checkout_session_completed = require('./webhooks/checkout.session.completed');
const account_updated = require('./webhooks/account.updated');

module.exports = async function ({ event }) {
  logger.debug('event', event);

  if (event.type === 'invoice.paid') {
    await invoice_paid(event);
  }

  if (event.type === 'checkout.session.completed') {
    await checkout_session_completed(event);
  }

  if (event.type === 'account.updated') {
    await account_updated(event);
  }
};
