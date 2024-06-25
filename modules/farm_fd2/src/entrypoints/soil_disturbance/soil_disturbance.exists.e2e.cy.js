describe('Soil Disturbance: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access Soil Disturbance form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2/soil_disturbance/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Main entry point elements exist', () => {
    cy.login('admin', 'admin');
    cy.visit('fd2/soil_disturbance/');
    cy.waitForPage();

    cy.get('[data-cy="soil-disturbance"]').should('exist');
    cy.get('[data-cy="soil-disturbance-card"]').should('be.visible');
    cy.get('[data-cy="soil-disturbance-header"]').should('be.visible');
    cy.get('[data-cy="soil-disturbance-header"]').should(
      'contain.text',
      'Soil Disturbance'
    );
    cy.get('[data-cy="soil-disturbance-form"]').should('exist');
  });

  it('Check that guest cannot access soil disturbance form', () => {
    /*
     * Skip this test if we are not running from the live farmOS
     * server.
     */
    cy.skipOn('localhost');

    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/soil_disturbance/', failOnStatusCode: false });
    cy.get('.page-title').should('contain.text', 'Access denied');
  });
});
