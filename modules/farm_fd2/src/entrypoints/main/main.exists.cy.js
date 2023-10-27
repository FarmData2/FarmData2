/* eslint-disable no-undef */

describe('Check that the main entrypoint in the fd2 module exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('/fd2/main/');
    // Check that the page loads.
    cy.waitForPage();
  });
});
