import { useEffect, useState } from 'react';
import config from '../config';

import {
  ApolloLink,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';

import { useAuth0 } from '@auth0/auth0-react';

import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import posthog from 'posthog-js';

export default function useAuth() {
  let {
    isLoading,
    logout,
    loginWithRedirect,
    getIdTokenClaims,
    user,
    error
  } = useAuth0();
  const [geo, setGeo] = useState();
  const [claims, setClaims] = useState();

  if (user) {
    user.isAdmin = user['https://hasura.io/jwt/claims'][
      'x-hasura-allowed-roles'
    ].includes('admin');

    posthog.init('w0z9i9MMxB49QpIRYaKvJ4UisUzGk3WsvWV4bxQ3Ar4', {
      api_host: 'https://vizee-posthog.herokuapp.com'
    });
    posthog.identify(user.sub);
    posthog.people.set({ email: user.email });
  }

  useEffect(() => {
    async function fetchData() {
      const claims = await getIdTokenClaims();
      setClaims(claims);
    }
    fetchData();
  }, [getIdTokenClaims]);

  const wsLink = new WebSocketLink({
    uri: config.graphql.replace('https', 'wss'),
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${claims?.__raw}`
        }
      }
    }
  });

  const httpLink = createHttpLink({
    uri: config.graphql
  });

  const authLink = setContext((_, { headers }) => {
    let context = {
      headers: {
        ...headers
      }
    };
    if (claims) {
      context.headers['Authorization'] = `Bearer ${claims.__raw}`;
      if (user.isAdmin) {
        context.headers['X-Hasura-Role'] = `admin`;
      }
    }
    return context;
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        if (message.includes('JWT')) {
          logout();
        }
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        return null;
      });

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const link = ApolloLink.split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  let client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, errorLink, link]),
    defaultHttpLink: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  });

  if (user && geo) {
    user.geo = geo;
  } else if (geo) {
    user = { geo };
  }

  return {
    isLoading,
    client,
    user,
    geo,
    setGeo,
    error,
    logout,
    loginWithRedirect
  };
}
