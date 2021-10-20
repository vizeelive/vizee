import { useEffect, useState } from 'react';
import config from '../config';
import Cookies from 'js-cookie';
import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';

import {
  ApolloLink,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';

import apolloLogger from 'apollo-link-logger';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

export default function useAuth() {
  const history = useHistory();
  const [geo, setGeo] = useState();

  let domain =
    process.env.NODE_ENV === 'production' ? '.vizee.live' : 'localhost';

  let qs = new URLSearchParams(window.location.search);
  if (qs.get('code')) {
    Cookies.set('vizee_token', qs.get('code'), {
      expires: 7,
      domain,
      secure: window.location.protocol === 'https:'
    });
    let returnTo = Cookies.get('returnTo', {
      domain,
      secure: window.location.protocol === 'https:'
    });
    Cookies.remove('returnTo', { domain });
    window.history.pushState({}, '', returnTo || window.location.origin);
  }

  let user = jwt.decode(Cookies.get('vizee_token'));

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
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': '5b1741f1-d335-45fa-a886-098d130ef6a1',
        'x-hasura-allowed-roles': ['user']
      }
    };
    if (role === 'admin') {
      user['https://hasura.io/jwt/claims']['x-hasura-allowed-roles'].push(
        'admin'
      );
    }
  }

  if (user) {
    user.token = Cookies.get('vizee_token');
    user.id = user['https://hasura.io/jwt/claims']['x-hasura-user-id'];
    user.code = user['https://hasura.io/jwt/claims']['x-hasura-user-code'];
    user.isAdmin = user['https://hasura.io/jwt/claims'][
      'x-hasura-allowed-roles'
    ].includes('admin');

    if (!window.Cypress) {
      posthog.init('mg9G9n0xj7ktBE9NfalasObycP6BJfzFWjWrEGO4CIs', {
        api_host: 'https://vizee-posthog.herokuapp.com'
      });
      posthog.identify(user.id);
      posthog.people.set({ email: user.email });

      window.mixpanel.identify(user.id);
      window.mixpanel.people.set({
        $email: user.email
      });
    }
  }

  // useEffect(() => {
  //   async function fetchData() {
  //     const claims = await getIdTokenClaims();
  //     setClaims(claims);
  //   }
  //   fetchData();
  // }, [getIdTokenClaims]);

  let token = id_token || Cookies.get('vizee_token');
  var wsLink = new WebSocketLink({
    uri: config.ws,
    options: {
      lazy: true,
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
    if (Cookies.get('vizee_token') || id_token) {
      context.headers['Authorization'] =
        `Bearer ` + (Cookies.get('vizee_token') || id_token);
      if (user?.isAdmin) {
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
          `GraphQL Error (${operation.operationName}): ${message}`,
          params
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

  const loginWithRedirect = ({ returnTo }) => {
    if (returnTo) {
      Cookies.set('returnTo', returnTo, {
        expires: 7,
        domain,
        secure: window.location.protocol === 'https:'
      });
    }
    history.push('/login');
  };

  const logout = () => {
    Cookies.remove('vizee_token', { domain });
    window.location.href = window.location.origin;
  };

  return {
    user,
    geo,
    setGeo,
    logout,
    client,
    loginWithRedirect
  };
}
