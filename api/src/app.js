const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const { fixAnonTransactions } = require('./mutations');

app.use(cors({ origin: '*' }));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = 3001;

app.get('/prerender', (req, res) => {
  let url = req.query.url;
  fetch(url, {
    headers: { 'User-Agent': 'Googlebot' }
  });
  res.send('OK');
});

app.get('/tickets/reconcile', async (req, res) => {
  let email = req.query.email;
  let user_id = req.query.user_id;
  try {
    await fixAnonTransactions({ email, user_id });
    res.send('OK');
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = app;
