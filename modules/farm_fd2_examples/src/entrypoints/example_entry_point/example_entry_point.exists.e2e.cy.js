describe('Example Entry Point: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access Example Entry Point form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2_examples/example_entry_point/');
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
    cy.visit('fd2_examples/example_entry_point/');
    cy.waitForPage();

    cy.get('[data-cy="example-entry-point"]').should('exist');
    cy.get('[data-cy="example-entry-point-card"]').should('be.visible');
    cy.get('[data-cy="example-entry-point-header"]').should('be.visible');
    cy.get('[data-cy="example-entry-point-header"]').should(
      'contain.text',
      'Example Entry Point'
    );
    cy.get('[data-cy="example-entry-point-form"]').should('exist');
  });
});
