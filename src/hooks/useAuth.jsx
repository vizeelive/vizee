import { useEffect, useState } from 'react';
import config from '../config';
import Cookies from 'js-cookie';
import * as Sentry from '@sentry/react';

import {
  ApolloLink,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';

import apolloLogger from 'apollo-link-logger';
import { useAuth0 } from '@auth0/auth0-react';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

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

  if (window.Cypress || process.env.REACT_APP_MOCK) {
    if (Cookies.get('test_role') === 'user') {
      user = require('./../mocks/fixtures/user.json');
    }
    if (Cookies.get('test_role') === 'admin') {
      user = require('./../mocks/fixtures/admin.json');
    }
  }

  // @cypress
  const id_token = Cookies.get('id_token');
  const role = Cookies.get('role');
  if (id_token) {
    user = {
      name: 'jeff@pixwel.com',
      sub: 'auth0|5f8838b47119bc007640b4af',
      'https://hasura.io/jwt/claims': { 'x-hasura-allowed-roles': ['user'] }
    };
    if (role === 'admin') {
      user['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'].push(
        'admin'
      );
    }
  }

  if (user) {
    user.id = user['https://hasura.io/jwt/claims']['x-hasura-user-id'];
    user.code = user['https://hasura.io/jwt/claims']['x-hasura-user-code'];
    user.isAdmin = user['https://hasura.io/jwt/claims'][
      'x-hasura-allowed-roles'
    ].includes('admin');

    window.mixpanel.identify(user.id);
    window.mixpanel.people.set({
      $email: user.email
    });
  }

  useEffect(() => {
    async function fetchData() {
      const claims = await getIdTokenClaims();
      setClaims(claims);
    }
    fetchData();
  }, [getIdTokenClaims]);

  let token = id_token || claims?.__raw;
  var wsLink = new WebSocketLink({
    uri: config.graphql.replace('https', 'wss'),
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
                'X-Hasura-Role': user?.isAdmin ? 'admin' : 'user'
              }
            : null)
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
    if (claims || id_token) {
      context.headers['Authorization'] =
        `Bearer ` + (claims?.__raw || id_token);
      if (user.isAdmin) {
        context.headers['X-Hasura-Role'] = `admin`;
      }
    }
    return context;
  });

  const errorLink = onError((errorParams) => {
    const { graphQLErrors, networkError, operation } = errorParams;
    if (graphQLErrors)
      graphQLErrors.map((params) => {
        const { message, locations, path } = params;
        if (message.includes('JWT')) {
          logout();
        }
        Sentry.captureException(
          `GraphQL Error (${operation.operationName}): ${message}`
        );
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        return null;
      });

    if (networkError) {
      Sentry.captureException(`GraphQL Error (${operation.operationName})`);
      console.log(`[Network error]: ${networkError}`, networkError);
    }
  });

  var link = ApolloLink.split(
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
    link: ApolloLink.from([apolloLogger, authLink, errorLink, link]),
    defaultHttpLink: false,
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
