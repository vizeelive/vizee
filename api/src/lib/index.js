const jwt_decode = require('jwt-decode');

/**
 * Decodes JWT and returns user
 *
 * @param {object} req the reques
 */
function getUser(req) {
  const token = req.headers.authorization.replace('Bearer ', '');
  return jwt_decode(token);
}

module.exports = { getUser };
