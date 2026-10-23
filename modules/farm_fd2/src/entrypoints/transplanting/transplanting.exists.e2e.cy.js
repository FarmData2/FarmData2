describe('Check that the transplanting entry point in farm_fd2 exists.', () => {
  it('Check that the page loaded.', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2/transplanting/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Check that guest cannot access transplanting form', () => {
    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/transplanting/', failOnStatusCode: false });

    // Skip this test if running on dev/prev servers because login only fails on live server.
    // Note: The test will be marked as pending because that is mocha's behavior.
    cy.url().then(function (url) {
      if (url.includes('localhost')) {
        this.skip();
      }
    });

    cy.get('.page-title').should('contain.text', 'Access denied');
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
