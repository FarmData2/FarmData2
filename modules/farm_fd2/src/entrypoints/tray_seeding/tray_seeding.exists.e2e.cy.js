describe('Check that the tray_seeding entry point in farm_fd2 exists.', () => {
  it('Check that admin can access tray seeding form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2/tray_seeding/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Check that guest cannot access tray seeding form', () => {
    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/tray_seeding/', failOnStatusCode: false });

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
    cy.visit('fd2/tray_seeding/');
    cy.waitForPage();

    cy.get('[data-cy="tray-seeding"]').should('exist');
    cy.get('[data-cy="tray-seeding-card"]').should('be.visible');
    cy.get('[data-cy="tray-seeding-header"]').should(
      'contain.text',
      'Tray Seeding'
    );
    cy.get('[data-cy="tray-seeding-form"]').should('be.visible');
  });
});
