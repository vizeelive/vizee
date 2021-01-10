const jwt_decode = require('jwt-decode');
const dayjs = require('dayjs');

/**
 * Decodes JWT and returns user
 *
 * @param {object} req the reques
 */
function getUser(req) {
  if (!('authorization' in req.headers)) {
    return { id: null, isAdmin: false };
  }
  const token = req.headers.authorization.replace('Bearer ', '');
  let user = jwt_decode(token);
  user.id = user['https://hasura.io/jwt/claims']['x-hasura-user-id'];
  user.isAdmin = user['https://hasura.io/jwt/claims'][
    'x-hasura-allowed-roles'
  ].includes('admin');
  return user;
}

/**
 * Generates an image link
 *
 * @param {*} params
 */
function generateImageLink(params) {
  const { event, account } = params;
  let date = dayjs(event?.start).format('MMM D, YYYY h:mm A');
  let title = encodeURIComponent(account.name);
  let subtitle = encodeURIComponent(event?.name);
  if (event) {
       return `https://ogi.sh/article?title=${title}&eyebrow=${date}&subtitle=${subtitle}&imageUrl=${
         event?.photo || account.photo
       }`;
  } else {
       return `https://ogi.sh/article?title=${title}&imageUrl=${
         event?.photo || account.photo
       }`;
  }
}

module.exports = { getUser, generateImageLink };
