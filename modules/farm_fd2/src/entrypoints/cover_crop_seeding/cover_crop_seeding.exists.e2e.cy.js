describe('Cover Crop Seeding: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access Cover Crop Seeding form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2/cover_crop_seeding/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Check that guest cannot access cover crop seeding form', () => {
    cy.skipOn('localhost');

    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/cover_crop_seeding/', failOnStatusCode: false });
    cy.get('.page-title').should('contain.text', 'Access denied');
  });

  it('Main entry point elements exist', () => {
    cy.login('admin', 'admin');
    cy.visit('fd2/cover_crop_seeding/');
    cy.waitForPage();

    cy.get('[data-cy="cover-crop-seeding"]').should('exist');
    cy.get('[data-cy="cover-crop-seeding-card"]').should('be.visible');
    cy.get('[data-cy="cover-crop-seeding-header"]').should('be.visible');
    cy.get('[data-cy="cover-crop-seeding-header"]').should(
      'contain.text',
      'Cover Crop Seeding'
    );
    cy.get('[data-cy="cover-crop-seeding-form"]').should('exist');
  });
});
