require('dotenv').config();
const AWS = require('aws-sdk');
const logger = require('../logger');

var s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });
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

async function presignUrl(params) {
  const { bucket, key } = params;
  const s3params = {
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: 'inline',
    ResponseContentType: 'video/mov'
  };
  return await s3.getSignedUrlPromise('getObject', s3params);
}

module.exports = { createChannel, presignUrl };
