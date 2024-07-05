describe('EquipmentSelector Example: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access EquipmentSelector Example form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2_examples/equipment_selector/');
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
    cy.visit('fd2_examples/equipment_selector/');
    cy.waitForPage();

    cy.get('[data-cy="equipment-selector"]').should('exist');
    cy.get('[data-cy="equipment-selector-card"]').should('be.visible');
    cy.get('[data-cy="equipment-selector-header"]').should('be.visible');
    cy.get('[data-cy="equipment-selector-header"]').should(
      'contain.text',
      'EquipmentSelector Example'
    );
    cy.get('[data-cy="equipment-selector-form"]').should('exist');
  });
});
