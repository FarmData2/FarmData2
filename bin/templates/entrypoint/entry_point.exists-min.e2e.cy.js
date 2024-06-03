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

  /*
   * Additional tests here should check to ensure that only appropriate users
   * have access to the page.
   *
   * See modules/farm_fd2/src/entrypoints/tray_seeding/tray_seeding.exists.e2e.cy.js
   * for an examples.
   */
  it('Main entry point elements exist', () => {
    cy.login('admin', 'admin');
    cy.visit('%DRUPAL_ROUTE%/');
    cy.waitForPage();

    cy.get('[data-cy="%ID_PREFIX%"]').should('exist');
    cy.get('[data-cy="%ID_PREFIX%-header"]')
      .should('be.visible')
      .should('contain.text', '%ENTRY_POINT_TITLE%');
    cy.get('[data-cy="%ID_PREFIX%-text"]')
      .should('be.visible')
      .should(
        'contain.text',
        'Placeholder content for the %ENTRY_POINT_TITLE% entry point.'
      );
  });
});
