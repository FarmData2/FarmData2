describe('%ENTRY_POINT_TITLE%: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access %ENTRY_POINT_TITLE% form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('%DRUPAL_ROUTE%/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Guest cannot access %ENTRY_POINT_TITLE% form', () => {
    /*
     * Skip this test if we are not running from the live farmOS
     * server.  If we are running on the dev or preview server then
     * the login does nothing and the test would fail because the page
     * would be served to the guest.  When running on the live farmOS
     * the login validates the guest credentials and enforces the permissions
     * set for the entry point.
     *
     * For some reason the test is marked as "pending" when it is skipped
     * in this way.  None the less, Cypress reports that all tests pass
     * both on the live server and on the dev server.
     */
    cy.skipOn('localhost');

    cy.login('guest', 'farmdata2');
    cy.visit({ url: '%DRUPAL_ROUTE%/', failOnStatusCode: false });
    cy.get('.page-title').should('contain.text', 'Access denied');
  });

  it('Main entry point elements exist', () => {
    cy.login('admin', 'admin');
    cy.visit('%DRUPAL_ROUTE%/');
    cy.waitForPage();

    cy.get('[data-cy="%ID_PREFIX%"]').should('exist');
    cy.get('[data-cy="%ID_PREFIX%-card"]').should('be.visible');
    cy.get('[data-cy="%ID_PREFIX%-header"]').should('be.visible');
    cy.get('[data-cy="%ID_PREFIX%-header"]').should(
      'contain.text',
      '%ENTRY_POINT_TITLE%'
    );
    cy.get('[data-cy="%ID_PREFIX%-form"]').should('exist');
  });
});
