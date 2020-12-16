const app = require('../app');
const bodyParser = require('body-parser');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.get('/stripe/session', require('./stripe/session'));

app.post(
  '/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }),
  function (req, res) {
    const sig = req.headers['stripe-signature'];

    try {
      var event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      require('./stripe/webhook')({ event });
      res.json({ recevied: true });
    } catch (err) {
      console.log(err);
      return res.status(500).send(`Webhook Error: ${err.message}`);
    }
  }
);
