const app = require('../app');
const config = require('../config');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const ShopifyToken = require('shopify-token');
const { updateShopify } = require('../mutations');

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

app.get('/shopify/callback', async (req, res) => {
  let state = JSON.parse(req.query.state);

  const shopifyToken = new ShopifyToken({
    redirectUri: config.ui,
    apiKey: process.env.SHOPIFY_CLIENT_ID,
    sharedSecret: process.env.SHOPIFY_CLIENT_SECRET
  });

  const ok = shopifyToken.verifyHmac(req.query);
  if (!ok) {
    return res.redirect(config.ui + state.url);
  }

  let { access_token } = await shopifyToken.getAccessToken(
    req.query.shop,
    req.query.code
  );

  let response = await fetch(
    `https://${req.query.shop}/admin/api/2021-01/storefront_access_tokens.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': access_token,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        storefront_access_token: {
          title: 'Vizee'
        }
      })
    }
  );

  let { storefront_access_token } = await response.json();

  let data = {
    shopify_storefront_token: storefront_access_token.access_token,
    shopify_domain: req.query.shop,
    shopify_token: access_token
  };

  await updateShopify({ account_id: state.account_id, data });

  res.redirect(config.ui + state.url);
});
