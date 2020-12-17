// src/mocks/handlers.js
import { graphql } from 'msw';

import Accounts from './fixtures/Accounts';
import AnonGetEvents from './fixtures/AnonGetEvents';
import AnonEventsReport from './fixtures/AnonEventsReport';
import GetComments from './fixtures/GetComments';
import TrackView from './fixtures/TrackView';

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

  //   graphql.query('ExampleQuery', (req, res, ctx) => {
  //     return res(ctx.data({}));
  //   }),

  //   graphql.mutation('ExampleMutation', (req, res, ctx) => {
  //     return res(ctx.data({}));
  //   }),

  graphql.mutation('TrackView', (req, res, ctx) => {
    return res(ctx.data(TrackView));
  }),

  graphql.query('AnonEventsReport', (req, res, ctx) => {
    return res(ctx.data(AnonEventsReport));
  }),

  graphql.query('AnonGetEvents', (req, res, ctx) => {
    return res(ctx.data(AnonGetEvents));
  }),

  graphql.query('Accounts', (req, res, ctx) => {
    return res(ctx.data(Accounts));
  }),

  graphql.query('GetComments', (req, res, ctx) => {
    return res(ctx.data(GetComments));
  })
];
