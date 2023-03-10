const config = require('../config');
const logger = require('../logger');
const { parse } = require('zipson');
const currency = require('currency.js');
const { pay } = require('./checkout');
const { generateImageLink } = require('./index');
const { getCheckoutData } = require('../queries');

async function session(params) {
  let { ref: refQuery } = params;

  ref = parseRef(refQuery);

  try {
    var { affiliate, event, account, product } = await getCheckoutData(ref);
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

  let unit_amount = price.replace(/[^\d]/g, '');
  let stripe_fee = unit_amount * 0.029 + 30;
  let amount = Math.round(unit_amount * account_percent - stripe_fee);

  let image = generateImageLink({ event, account });

  let origin = account?.domain ? `https://${account?.domain}` : config.ui;

  if (ref.isTip) {
    if (!ref.amount.includes('.')) {
      price = `${ref.amount}.00`;
    } else {
      price = ref.amount;
    }
    unit_amount = price.replace('$', '').replace('.', '');
    stripe_fee = unit_amount * 0.029 + 30;
    amount = Math.round(unit_amount * account_percent - stripe_fee);
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

function parseRef(ref) {
  if (!ref) {
    throw new Error('Missing ref');
  }
  ref = parse(decodeURIComponent(ref));
  logger.debug('Found ref', { ref });
  return ref;
}

module.exports = session;
