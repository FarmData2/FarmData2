describe('Check that the direct_seeding entry point in farm_fd2 exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2/direct_seeding/');
    // Check that the page loads.
    cy.waitForPage();
  });
});
