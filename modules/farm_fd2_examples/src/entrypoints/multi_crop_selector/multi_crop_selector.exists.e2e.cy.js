describe('MultiCropSelector Example: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access MultiCropSelector Example form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2_examples/multi_crop_selector/');
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
    cy.visit('fd2_examples/multi_crop_selector/');
    cy.waitForPage();

    cy.get('[data-cy="multi-crop-selector"]').should('exist');
    cy.get('[data-cy="multi-crop-selector-card"]').should('be.visible');
    cy.get('[data-cy="multi-crop-selector-header"]').should('be.visible');
    cy.get('[data-cy="multi-crop-selector-header"]').should(
      'contain.text',
      'MultiCropSelector Example'
    );
    cy.get('[data-cy="multi-crop-selector-form"]').should('exist');
  });
});
