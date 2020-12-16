const config = require('../../config');
const { parse } = require('zipson');
const currency = require('currency.js');
const { subscribe, pay } = require('../../lib/checkout');
const { generateImageLink } = require('../../lib');
const { getCheckoutData } = require('../../queries');

module.exports = async function (req, res) {
  let ref = parse(decodeURIComponent(req.query.ref));
  console.log({ ref });

  try {
    var { event, account, product } = await getCheckoutData(ref);
  } catch (e) {
    res.status(500).send(e.message);
  }

  // TODO check for existing access and return successfully

  const account_percent = currency(1 - account.fee_percent / 100);

  let price = ref.product_id ? product.price : event.price;

  let unit_amount = price.replace('$', '').replace('.', '');
  let amount = unit_amount * account_percent;

  let image = generateImageLink({ event, account });

  let origin = account.domain ? `https://${account.domain}` : config.ui;

  try {
    let session = await pay({
      ref: req.query.ref,
      origin,
      account,
      event,
      amount,
      unit_amount,
      image,
      email: ref.email
    });

    res.send(session);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
};
