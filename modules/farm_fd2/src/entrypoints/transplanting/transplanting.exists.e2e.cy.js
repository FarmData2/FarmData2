describe('Check that the transplanting entry point in farm_fd2 exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2/transplanting/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Check overall page structure', () => {
    cy.login('admin', 'admin');
    cy.visit('fd2/transplanting/');
    cy.waitForPage();

    cy.get('[data-cy="transplanting"]').should('exist');
    cy.get('[data-cy="transplanting-card"]').should('be.visible');
    cy.get('[data-cy="transplanting-header"]').should(
      'contain.text',
      'Transplanting'
    );
    cy.get('[data-cy="transplanting-form"]').should('be.visible');
  });
});
