describe('Check that the sort_order_button entry point in farm_fd2_examples exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2_examples/sort_order_button/');
    // Check that the page loads.
    cy.waitForPage();
  });
});
