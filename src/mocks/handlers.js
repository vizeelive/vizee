// src/mocks/handlers.js
import { graphql } from 'msw';

import Accounts from './fixtures/Accounts';
import AnonGetEvents from './fixtures/AnonGetEvents';

export const handlers = [
  //   // Handles a "Login" mutation
  //   graphql.mutation('Login', (req, res, ctx) => {
  //     const { username } = req.variables;
  //     sessionStorage.setItem('is-authenticated', username);

  //     return res(
  //       ctx.data({
  //         login: {
  //           username
  //         }
  //       })
  //     );
  //   }),

  //   graphql.query('Example', (req, res, ctx) => {
  //     return res(ctx.data({}));
  //   }),

  graphql.query('AnonGetEvents', (req, res, ctx) => {
    return res(ctx.data(AnonGetEvents));
  }),

  graphql.query('Accounts', (req, res, ctx) => {
    return res(ctx.data(Accounts));
  })

  // Handles a "GetUserInfo" query
  //   graphql.query('GetUserInfo', (req, res, ctx) => {
  //     const authenticatedUser = sessionStorage.getItem('is-authenticated');

  //     if (!authenticatedUser) {
  //       // When not authenticated, respond with an error
  //       return res(
  //         ctx.errors([
  //           {
  //             message: 'Not authenticated',
  //             errorType: 'AuthenticationError'
  //           }
  //         ])
  //       );
  //     }

  //     // When authenticated, respond with a query payload
  //     return res(
  //       ctx.data({
  //         user: {
  //           username: authenticatedUser,
  //           firstName: 'John'
  //         }
  //       })
  //     );
  //   })
];
