describe('MultiSelectorBase Example: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access MultiSelectorBase Example form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2_examples/multi_selector_base/');
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
    cy.visit('fd2_examples/multi_selector_base/');
    cy.waitForPage();

    cy.get('[data-cy="multi-selector-base"]').should('exist');
    cy.get('[data-cy="multi-selector-base-card"]').should('be.visible');
    cy.get('[data-cy="multi-selector-base-header"]').should('be.visible');
    cy.get('[data-cy="multi-selector-base-header"]').should(
      'contain.text',
      'MultiSelectorBase Example'
    );
    cy.get('[data-cy="multi-selector-base-form"]').should('exist');
  });
});
