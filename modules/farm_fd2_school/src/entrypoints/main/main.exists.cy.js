/* eslint-disable no-undef */

describe('Check that the main entrypoint in farm_fd2_school exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('/fd2_school/main/');
    // Check that the page loads.
    cy.waitForPage();
  });
});
