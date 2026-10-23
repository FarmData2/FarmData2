describe('Direct Seeding: Exists', () => {
  it('Check that admin can access the direct seeding form.', () => {
    cy.login('admin', 'admin');
    cy.visit('fd2/direct_seeding/');
    cy.waitForPage();
  });

  it('Check that guest cannot access tray seeding form', () => {
    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/direct_seeding/', failOnStatusCode: false });

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
    cy.visit('fd2/direct_seeding/');
    cy.waitForPage();

    cy.get('[data-cy="direct-seeding"]').should('exist');
    cy.get('[data-cy="direct-seeding-card"]').should('be.visible');
    cy.get('[data-cy="direct-seeding-header"]').should(
      'contain.text',
      'Direct Seeding'
    );
    cy.get('[data-cy="direct-seeding-form"]').should('be.visible');
  });
});
