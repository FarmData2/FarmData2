/* eslint-disable no-undef */

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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * This command will log into farmOS if we are currently connecting to it.
 * That is if the tests are running with a base url of http://farmos then
 * the user is logged in.  If the test are running with any other base url
 * then no login is performed.
 */
Cypress.Commands.add('login', (user, password) => {
  let baseURL = Cypress.config().baseUrl;
  if (baseURL.includes('http://farmos')) {
    cy.request({
      method: 'POST',
      url: '/user/login',
      form: true,
      body: {
        name: user,
        pass: password,
        form_id: 'user_login_form',
      },
    });
  }
});

// Cypress.Commands.add('logout', () => {
//   cy.request({
//     method: 'POST',
//     url: '/user/logout',
//     form: true,
//     body: {},
//   })
// })

/**
 * This command works with a pattern in the page to wait for
 * api calls initiated in the created() method to complete.
 *
 * To use this command the page should contain the following:
 *
 * The <div>:
 *   <div data-cy="page-loaded" v-show=false>{{ pageLoaded }}</div>
 *
 * The data element:
 *   createdCount: 0,
 *
 * A computed function where the value in the comparison (e.g. 1)
 * is determined by the number of api calls to wait for:
 *   pageLoaded() {
 *     return this.createdCount == 1
 *   },
 *
 * In the created() method, in a then() associated with each API call
 * include the line:
 *   this.createdCount++
 *
 * See the fd2_example/vars/vars.html and fd2_example/api/api.html pages
 * for some examples.
 */
Cypress.Commands.add('waitForPage', () => {
  cy.get('[data-cy=page-loaded]').should('have.text', 'true');
});
