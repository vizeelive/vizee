const dayjs = require('dayjs');

const { updateSubscription } = require('../../../mutations');

async function invoice_paid(event) {
  const expiry = dayjs(
    event.data.object.lines.data[0].period.end * 1000
  ).format('YYYY-MM-DD HH:mm:ss');
  let subscription_id = event.data.object.subscription;
  await updateSubscription({ subscription_id, expiry });
}

module.exports = invoice_paid;
