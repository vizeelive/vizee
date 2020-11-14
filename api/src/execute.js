const config = require('./config');
const fetch = require('node-fetch');

const execute = async (gql, variables, headers) => {
  const fetchResponse = await fetch(config.api, {
    method: 'POST',
    headers: {
      Authorization: headers.authorization,
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
    },
    body: JSON.stringify({
      query: gql,
      variables
    })
  });
  return await fetchResponse.json();
};

module.exports = execute;
