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

/*
 * Cypress clears the local and session storage between tests.  This work around
 * can be used to copy the local or session storage at the end of each test
 * (i.e. in an afterEach) and then restore it at the start of the
 * the next test (i.e. in a beforeEach).
 *
 * This work around was created by Michal Pietraszko (pietmichal on GitHub):
 * https://github.com/cypress-io/cypress/issues/461#issuecomment-392070888
 */
let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

let SESSION_STORAGE_MEMORY = {};

Cypress.Commands.add('saveSessionStorage', () => {
  Object.keys(sessionStorage).forEach((key) => {
    SESSION_STORAGE_MEMORY[key] = sessionStorage[key];
  });
});

Cypress.Commands.add('restoreSessionStorage', () => {
  Object.keys(SESSION_STORAGE_MEMORY).forEach((key) => {
    sessionStorage.setItem(key, SESSION_STORAGE_MEMORY[key]);
  });
});

/*
 * Cypress command that allows us to get multiple aliases
 * using a single command such as:
 * cy.getAll(['@alias1', '@alias2', '@alias3']), rather than a chain of
 * cy.get('@alias1').then((name) => ...) commands.
 *
 * This simplifies the code in a number of test functions.
 *
 * Function adapted from: https://stackoverflow.com/a/76985546
 */
Cypress.Commands.add('getAll', function (aliasNames) {
  return aliasNames.map((a) => {
    return this[a.substring(1)];
  });
});
