describe('ActivePlantAssetPicklist: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can access ActivePlantAssetPicklist form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the entry point page.
    cy.visit('fd2_examples/active_plant_asset_picklist/');
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
    cy.visit('fd2_examples/active_plant_asset_picklist/');
    cy.waitForPage();

    cy.get('[data-cy="active-plant-asset-picklist"]').should('exist');
    cy.get('[data-cy="active-plant-asset-picklist-card"]').should('be.visible');
    cy.get('[data-cy="active-plant-asset-picklist-header"]').should('be.visible');
    cy.get('[data-cy="active-plant-asset-picklist-header"]').should(
      'contain.text',
      'ActivePlantAssetPicklist'
    );
    cy.get('[data-cy="active-plant-asset-picklist-form"]').should('exist');
  });
});
