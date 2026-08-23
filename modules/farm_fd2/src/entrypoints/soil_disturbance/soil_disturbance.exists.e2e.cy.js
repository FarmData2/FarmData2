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
    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/soil_disturbance/', failOnStatusCode: false });

    // Skip this test if running on dev/prev servers because login only fails on live server.
    // Note: The test will be marked as pending because that is mocha's behavior.
    cy.url().then(function (url) {
      if (url.includes('localhost')) {
        this.skip();
      }
    });

    cy.get('.page-title').should('contain.text', 'Access denied');
  });
});
