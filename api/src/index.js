require('dotenv').config();
const app = require('./app');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  10
);
// const Tracing = require('@sentry/tracing');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const config = require('./config');
const { getUserId } = require('./queries');
const {
  fixAnonTransactions,
  createUser,
  createAccount
} = require('./mutations');

sgMail.setApiKey(process.env.SENDGRID_TOKEN);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn:
      'https://91a739d55cb0416086666bd8c11a234c@o473703.ingest.sentry.io/5511747',

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  });
}

require('./controllers/ivs');
require('./controllers/stripe');
require('./controllers/mux');
const actions = require('./actions');

/**
 * Hasura Actions interceptor
 */
app.post(
  '/',
  bodyParser.json({ type: 'application/json' }),
  async (req, res) => {
    let action = req.body.action.name;
    try {
      return actions[action](req, res);
    } catch (e) {
      console.log(`Missing ${action}`, e);
      res.status(500);
    }
  }
);

app.post(
  '/auth',
  bodyParser.json({ type: 'application/json' }),
  async (req, res) => {
    var email = req.body.email;

    let user = await getUserId({ email });
    if (!user?.id) {
      const sub = `email|${email}`;
      const name = `${email}'s Channel`;
      const username = nanoid();
      const code = nanoid(7);
      user = await createUser({
        object: { sub, name, email, code }
      });
      await fixAnonTransactions({ email, user_id: user.id });
      await createAccount({ username, name, user_id: user.id });
    }

    let token = jwt.sign(
      {
        email,
        'https://hasura.io/jwt/claims': {
          'x-hasura-default-role': 'user',
          'x-hasura-allowed-roles': ['user'].concat(['admin']),
          'x-hasura-user-id': user.id,
          'x-hasura-user-code': user.code
        }
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '72h'
      }
    );
    let link = `${config.ui}?code=${token}`;

    const msg = {
      to: email,
      from: 'jeff@viz.ee',
      subject: 'Log in to Vizee',
      text: link
    };
    sgMail.send(msg);
    res.send();
  }
);
