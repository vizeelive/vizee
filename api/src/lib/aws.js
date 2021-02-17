const AWS = require('aws-sdk');
const logger = require('../logger');

var ivs = new AWS.IVS({ apiVersion: '2020-07-14', region: 'us-east-1' });

function createChannel(params) {
  const { event } = params;
  var params = {
    authorized: false,
    latencyMode: 'LOW',
    name: event.id,
    type: 'STANDARD'
  };
  try {
    logger.info(`Creating channel`, params);
    return ivs.createChannel(params).promise();
  } catch (e) {
    logger.error(`Failed to create channel: ${e.message}`, { params, e });
    throw e;
  }
}

module.exports = { createChannel };
