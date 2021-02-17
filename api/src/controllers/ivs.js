const app = require('../app');
const logger = require('../logger');
const bodyParser = require('body-parser');
const { client } = require('../setup');
const { gql } = require('@apollo/client/core');

app.post(
  '/ivs/status',
  bodyParser.json({ type: 'application/json' }),
  async function (req, res) {
    logger.info('Received IVS webhook');

    let status;
    let ivs_channel_arn = req.body.resources[0];

    switch (req.body.detail.event_name) {
      case 'Stream End':
        status = 'completed';
        break;
      case 'Stream Start':
        status = 'live';
        break;
    }

    try {
      await client.mutate({
        variables: {
          ivs_channel_arn,
          status
        },
        mutation: gql`
          mutation UpdateIvsStatus($ivs_channel_arn: String, $status: String) {
            update_events(
              where: { ivs_channel_arn: { _eq: $ivs_channel_arn } }
              _set: { status: $status }
            ) {
              returning {
                id
              }
            }
          }
        `
      });
    } catch (e) {
      logger.error('Failed to update event stream status: ' + e.message, {
        body: req.body
      });
    }
    logger.info('Webhook success', { status, ivs_channel_arn });
    res.send('OK');
  }
);
