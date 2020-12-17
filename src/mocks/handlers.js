// src/mocks/handlers.js
import { rest, graphql } from 'msw';
import Cookie from 'js-cookie';

import token from './fixtures/token';
import Accounts from './fixtures/Accounts';
import AnonGetEvents from './fixtures/AnonGetEvents';
import AnonEventsReport from './fixtures/AnonEventsReport';
import GetComments from './fixtures/GetComments';
import TrackView from './fixtures/TrackView';
import SearchEvents from './fixtures/SearchEvents';
import AdminGetAccountByUsername from './fixtures/AdminGetAccountByUsername';
import FinishSignup from './fixtures/FinishSignup';
import GetProducts from './fixtures/GetProducts';
import GetAccount from './fixtures/GetAccount';

Cookie.set('auth0.is.authenticated', true);

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
  //     return res(ctx.data(Response));
  //   }),

  //   graphql.mutation('ExampleMutation', (req, res, ctx) => {
  //     return res(ctx.data(Response));
  //   }),

  graphql.query('GetAccount', (req, res, ctx) => {
    return res(ctx.data(GetAccount));
  }),

  graphql.query('FinishSignup', (req, res, ctx) => {
    return res(ctx.data(FinishSignup));
  }),

  graphql.query('AdminGetAccountByUsername', (req, res, ctx) => {
    return res(ctx.data(AdminGetAccountByUsername));
  }),

  rest.post('/oauth/token', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(token));
  }),

  graphql.mutation('TrackView', (req, res, ctx) => {
    return res(ctx.data(TrackView));
  }),

  graphql.query('GetProducts', (req, res, ctx) => {
    return res(ctx.data(GetProducts));
  }),

  graphql.query('SearchEvents', (req, res, ctx) => {
    return res(ctx.data(SearchEvents));
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
