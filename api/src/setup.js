const config = require('./config');
const fetch = require('node-fetch');
const { setContext } = require('@apollo/link-context');

var { ApolloClient, createHttpLink, InMemoryCache } = require('@apollo/client');

const httpLink = createHttpLink({
  uri: config.api,
  fetch
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
      'x-hasura-role': 'admin'
    }
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only'
      // errorPolicy: 'all'
    },
    query: {
      fetchPolicy: 'network-only'
      // errorPolicy: 'all'
    },
    mutate: {
      // errorPolicy: 'all'
    }
  }
});

module.exports = { client };
