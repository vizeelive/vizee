const jwt_decode = require('jwt-decode');
const dayjs = require('dayjs');

/**
 * Decodes JWT and returns user
 *
 * @param {object} req the reques
 */
function getUser(req) {
  const token = req.headers.authorization.replace('Bearer ', '');
  return jwt_decode(token);
}

/**
 * Generates an image link
 *
 * @param {*} params
 */
function generateImageLink(params) {
  const { event, account } = params;
  let date = dayjs(event.start).format('MMM D, YYYY h:mm A');
  let title = encodeURIComponent(account.name);
  let subtitle = encodeURIComponent(event.name);
  return `https://ogi.sh/article?title=${title}&eyebrow=${date}&subtitle=${subtitle}&imageUrl=${
    event.photo || account.photo
  }`;
}

module.exports = { getUser, generateImageLink };
