const fetch = require("node-fetch");

const execute = async (gql, variables, headers) => {
  const fetchResponse = await fetch(
    "https://cool-teal-29.hasura.app/v1/graphql",
    {
      method: 'POST',
      headers: {
        Authorization: headers.authorization
      },
      body: JSON.stringify({
        query: gql,
        variables
      })
    }
  );
  return await fetchResponse.json();
};

module.exports = execute;
