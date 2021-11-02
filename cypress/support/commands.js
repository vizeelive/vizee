// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('gql', (mocks) => {
  cy.window()
    .its('mockServer')
    .then((mockServer) => {
      mockServer.intercept(mocks);
    });
});

Cypress.Commands.add('globalIntercepts', () => {
    cy.intercept('https://ipinfo.io', {
      ip: '45.17.98.35',
      hostname: '45-17-98-35.lightspeed.moblal.sbcglobal.net',
      city: 'Mobile',
      region: 'Alabama',
      country: 'US',
      loc: '30.6944,-88.0430',
      org: 'AS7018 AT&T Services, Inc.',
      postal: '36601',
      timezone: 'America/Chicago'
    });
    cy.intercept('https://m.stripe.com', {
      muid: '40f721a4-89d0-4857-bb2b-762db4d71ddbc48793',
      guid: '37a62374-90ee-481f-9dcc-8386d5c1734b804edf',
      sid: '0673f008-ff82-43fe-ad7b-5d5d3ec8d7aaeb913e'
    });
    cy.intercept('https://www.google-analytics.com/*');
    cy.intercept('POST', '/api/collect', '');
    cy.intercept('POST', 'https://*.litix.io/', '');
});

Cypress.Commands.add('graphql', (name, params) => {
  cy.intercept('graphql', (req) => {
    if (req.body.operationName === name) {
      if ('fixture' in params) {
        req.reply({
          data: require(`../fixtures/${params.fixture}.json`)
        });
      } else if (params) {
        req.reply({ data: params });
      } else {
        req.reply();
      }
    }
  });
});

Cypress.Commands.add('login', (user) => {
  let token;
  switch (user) {
    case 'jeff@loiselles.com':
      token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZAbG9pc2VsbGVzLmNvbSIsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciJdLCJ4LWhhc3VyYS11c2VyLWlkIjoiMWYwYzExN2MtZWFlNS00NzFiLTkzZDctZDYwZGY3NDA3NGI3IiwieC1oYXN1cmEtdXNlci1jb2RlIjoibHVXd1ZmMjk1ZyJ9LCJpYXQiOjE2MzU0NDY0MTgsImV4cCI6MjU4MjE3NDQxOH0.G41mbu_r_RAuSOJRB1-8wFfO-50Q-TNjFkWV1wmG-3o';
      break;
    case 'jeff@viz.ee':
      token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImplZmZAdml6LmVlIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtdXNlci1pZCI6IjNmNzM5YmM1LTliMDEtNGM0MC1iZWU1LWZkZGIxOGZmZjQ1NyIsIngtaGFzdXJhLXVzZXItY29kZSI6ImllYTJod0RQM0IifSwiaWF0IjoxNjM1NDQ2MzcxLCJleHAiOjI1ODIxNzQzNzF9.vJDNpKbKhLxLsNZTRfd7D_dziYfiMn2LWU6JVhi1oQ0';
      break;
  }
  cy.setCookie('vizee_token', token);
});
