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
import Cookies from 'js-cookie';

Cypress.Commands.add('login', (role) => {
  Cypress.log({
    name: 'loginViaAuth0'
  });

  let username =
    role === 'admin'
      ? Cypress.env('auth_admin_username')
      : Cypress.env('auth_username');

  let password =
    role === 'admin'
      ? Cypress.env('auth_admin_password')
      : Cypress.env('auth_password');

  const options = {
    method: 'POST',
    url: Cypress.env('auth_url'),
    body: {
      grant_type: 'password',
      reponse_type: 'code',
      username,
      password,
      audience: Cypress.env('auth_audience'),
      scope: 'openid profile email',
      client_id: Cypress.env('auth_client_id'),
      client_secret: Cypress.env('auth_client_secret')
    }
  };
  cy.request(options)
    .then((resp) => {
      return resp.body;
    })
    .then((body) => {
      const { id_token } = body;
      Cookies.set('id_token', id_token);
      Cookies.set('role', role);
    });
});
