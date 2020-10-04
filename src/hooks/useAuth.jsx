import config from "../config";
import { useEffect, useState } from "react";

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";

import { useAuth0 } from "@auth0/auth0-react";

import { setContext } from "@apollo/link-context";

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

  let client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  return {
    isLoading,
    client,
    user,
    error,
    logout,
    loginWithRedirect,
  };
}
