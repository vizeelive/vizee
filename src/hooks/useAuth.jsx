import React from "react";
import config from "../config";
import { useEffect, useState, useMemo } from "react";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

import { useAuth0 } from "@auth0/auth0-react";

import { setContext } from "@apollo/link-context";
import { onError } from "@apollo/client/link/error";

// import posthog from "posthog-js";

export default function useAuth() {
  const {
    isLoading,
    logout,
    loginWithRedirect,
    getIdTokenClaims,
    user,
    error,
  } = useAuth0();
  const [geo, setGeo] = useState();
  const [claims, setClaims] = useState();

  if (user) {
    user.isAdmin = user["https://hasura.io/jwt/claims"][
      "x-hasura-allowed-roles"
    ].includes("admin");

    // posthog.identify(user.sub);
    // posthog.people.set({ email: user.email });
  }

  useEffect(() => {
    async function fetchData() {
      const claims = await getIdTokenClaims();
      setClaims(claims);
    }
    fetchData();
  }, [getIdTokenClaims]);

  const httpLink = createHttpLink({
    uri: config.graphql,
  });

  const authLink = setContext((_, { headers }) => {
    let context = {
      headers: {
        ...headers,
      },
    };
    if (claims) {
      context.headers["Authorization"] = `Bearer ${claims.__raw}`;
      if (user.isAdmin) {
        context.headers["X-Hasura-Role"] = `admin`;
      }
    }
    return context;
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        if (message.includes("JWT")) {
          logout();
        }
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        return null;
      });

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  let client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(errorLink).concat(httpLink),
  });

  if (user && geo) {
    user.geo = geo;
  }

  return {
    isLoading,
    client,
    user,
    geo,
    setGeo,
    error,
    logout,
    loginWithRedirect,
  };
}
