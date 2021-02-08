const config = require('../config');
const logger = require('../logger');
const { parse } = require('zipson');
const currency = require('currency.js');
const { pay } = require('./checkout');
const { generateImageLink } = require('./index');
const {
  getCheckoutDataAccount,
  getCheckoutDataEvent,
  getCheckoutDataAccountOnly
} = require('../queries');

async function session(params) {
  let { ref: refQuery } = params;

  ref = parse(decodeURIComponent(refQuery));
  logger.debug('Found ref', { ref });

  try {
    var account, event, product;
    if (ref.product_id) {
      var { event, account, product } = await getCheckoutDataAccount(ref);
    } else if (ref?.event_id) {
      var { event, account } = await getCheckoutDataEvent(ref);
    } else {
      var { account } = await getCheckoutDataAccountOnly(ref);
    }
  } catch (e) {
    logger.error(`Failed to fetch data for checkout: ${e.message}`, { ref });
    throw new Error(e.message);
  }

  logger.info('Determining action', { event, account, product });

  let action;
  if (ref.product_id) {
    if (product.account_access) {
      if (product.recurring) {
        action = 'account.subscribe';
      } else {
        action = 'account.purchase';
      }
    } else {
      action = 'event.purchase';
    }
  } else {
    action = 'event.purchase';
  }

  if (ref.isTip) {
    action = ref.event_id ? 'event.tip' : 'account.tip';
  }

  logger.info(`Action ${action}`);

  // TODO check for existing access and return successfully
  const account_percent = currency(1 - account?.fee_percent / 100);

  let price = product?.price || event?.price || '0';
  if (!price.includes('.')) {
    price = `${price}.00`;
  }

  let unit_amount = price.replace('$', '').replace('.', '');
  let amount = Math.round(unit_amount * account_percent);

  let image = generateImageLink({ event, account });

  let origin = account?.domain ? `https://${account?.domain}` : config.ui;

  if (ref.isTip) {
    if (!ref.amount.includes('.')) {
      price = `${ref.amount}.00`;
    } else {
      price = ref.amount;
    }
    unit_amount = price.replace('$', '').replace('.', '');
    amount = unit_amount;
  }

  try {
    var data = {
      action,
      ref: refQuery,
      isTip: ref.isTip,
      origin,
      account,
      event,
      amount,
      unit_amount,
      image,
      email: ref.email
    };
    let session = await pay(data);
    return session;
  } catch (e) {
    logger.error(`Failed to create stripe checkout session: ${e.message}`, {
      data
    });
    throw e;
  }
}

module.exports = session;
