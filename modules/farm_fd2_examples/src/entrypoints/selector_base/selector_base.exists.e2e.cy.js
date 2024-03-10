describe('Check that the selector_base entry point in farm_fd2_examples exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2_examples/selector_base/');
    // Check that the page loads.
    cy.waitForPage();
  });
});
