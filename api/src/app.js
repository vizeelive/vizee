const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const { fixAnonTransactions } = require('./mutations');

const { getMattermostToken } = require('./lib/getMattermostToken');
const jwt_decode = require('jwt-decode');

app.use(
  cors({
    origin: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Name'],
    credentials: true
  })
);
app.use(cookieParser());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = 3001;

app.get('/chat', async (req, res) => {
  let name = req.query.name;
  let channel = req.query.channel;
  let user = jwt_decode(req.query.token);
  let token = await getMattermostToken({ name, email: user.email });

  res.cookie('MMUSERID', token.MMUSERID, {
    domain: 'vizee.live',
    expires: 0,
    secure: true,
    sameSite: 'None'
  });

  res.cookie('MMAUTHTOKEN', token.MMAUTHTOKEN, {
    domain: 'vizee.live',
    expires: 0,
    secure: true,
    httpOnly: true,
    sameSite: 'None'
  });

  res.redirect(`https://chat.vizee.live/vizee/channels/${channel}`);
});

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
