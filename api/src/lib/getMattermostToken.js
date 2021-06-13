const logger = require('../logger');
const fetch = require('node-fetch');
const { getUser } = require('../lib');
const mattermost = require('../lib/mattermost');

/**
 * Generates a unique/temporary username for a chat user
 *
 * @param {string} inputName users full name
 * @returns string
 */
function generateUsername(inputName) {
  let number = Math.floor(Math.random() * 90000) + 10000;
  let name = inputName.toLowerCase().replace(/\W/g, '');
  return `${name}-${number}`;
}

/**
 * Creates user, logs in, and return auth token.
 *
 * @param {object} param0 object
 * @returns string
 */
async function getMattermostToken({ name, email }) {
  let username = generateUsername(name);

  try {
    await mattermost.createUser({ email, username });
    return await mattermost.login({ email });
  } catch (e) {
    logger.error(`Failed to create Mattermost user: ${e.message}`);
    throw e;
  }
}

module.exports = { generateUsername, getMattermostToken };
