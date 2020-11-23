const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');

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

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

module.exports = app;
