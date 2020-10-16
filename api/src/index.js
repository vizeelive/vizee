require('dotenv').config();
const app = require('./app');
const bodyParser = require('body-parser');

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
