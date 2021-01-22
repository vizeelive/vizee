const config = require('../../config');
const logger = require('../../logger');
const { parse } = require('zipson');
const currency = require('currency.js');
const { pay } = require('../../lib/checkout');
const { generateImageLink } = require('../../lib');
const {
  getCheckoutDataAccount,
  getCheckoutDataEvent
} = require('../../queries');

module.exports = async function (req, res) {
  let ref = parse(decodeURIComponent(req.query.ref));
  console.log({ ref });

  try {
    if (ref.product_id) {
      var { event, account, product } = await getCheckoutDataAccount(ref);
    } else {
      var { event, account } = await getCheckoutDataEvent(ref);
    }
  } catch (e) {
    res.status(500).send(e.message);
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
    action = 'tip';
  }

  logger.info(`Action ${action}`);

  // TODO check for existing access and return successfully
  const account_percent = currency(1 - account.fee_percent / 100);

  let price = ref.product_id ? product.price : event.price;
  if (!price.includes('.')) {
    price = `${price}.00`;
  }

  let unit_amount = price.replace('$', '').replace('.', '');
  let amount = Math.round(unit_amount * account_percent);

  let image = generateImageLink({ event, account });

  let origin = account.domain ? `https://${account.domain}` : config.ui;

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
      ref: req.query.ref,
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
    res.send(session);
  } catch (e) {
    console.error(`Failed to create stripe checkout session: ${e.message}`, {
      data
    });
    res.status(500).send('Checkout failed');
  }
};;
