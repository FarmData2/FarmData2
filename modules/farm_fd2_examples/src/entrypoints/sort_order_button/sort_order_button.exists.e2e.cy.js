describe('SortOrderButton: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access SortOrderButton form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2_examples/sort_order_button/');
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
    cy.visit('fd2_examples/sort_order_button/');
    cy.waitForPage();

    cy.get('[data-cy="sort-order-button"]').should('exist');
    cy.get('[data-cy="sort-order-button-card"]').should('be.visible');
    cy.get('[data-cy="sort-order-button-header"]').should('be.visible');
    cy.get('[data-cy="sort-order-button-header"]').should(
      'contain.text',
      'SortOrderButton'
    );
    cy.get('[data-cy="sort-order-button-form"]').should('exist');
  });
});
