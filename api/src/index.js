require('dotenv').config();
const app = require('./app');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn:
    'https://91a739d55cb0416086666bd8c11a234c@o473703.ingest.sentry.io/5511747',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
});

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
    return actions[action](req, res);
  }
);
