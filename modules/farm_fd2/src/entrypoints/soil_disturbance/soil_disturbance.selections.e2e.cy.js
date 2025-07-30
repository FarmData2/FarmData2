describe('Soil Disturbance: Bed and Plant Asset Picklist', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/soil_disturbance/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Shows neither BedSelector nor ActivePlantAssetPicklist for location J)', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('J');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should('not.exist');
    cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
  });

  it('Shows only ActivePlantAssetPicklist for location A', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should('not.exist');
    cy.get('[data-cy="active-plant-asset-picklist"]')
      .should('exist')
      .and('be.visible');
  });

  it('Shows only BedPicker for location H', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="active-plant-asset-bed-picker"]')
      .should('exist')
      .and('be.visible');
    cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
  });

  it('Shows both BedPicker and ActivePlantAssetPicklist for location ALF', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="active-plant-asset-bed-picker"]')
      .should('exist')
      .and('be.visible');
    cy.get('[data-cy="active-plant-asset-picklist"]')
      .should('exist')
      .and('be.visible');
  });

  it('Styling is applied to both BedPicker and ActivePlantAssetPicklist', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="termination-event-checkbox"]').check();
    cy.get('[data-cy="submit-button"]').click();

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .should('not.have.class', 'is-valid')
      .should('have.class', 'is-invalid');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .eq(3)
      .should('not.have.class', 'is-valid')
      .should('have.class', 'is-invalid');
    cy.get('[data-cy="picker-invalid-feedback"]').should('be.visible');

    cy.get('[data-cy="picklist-table"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="picklist-table"]').should('have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('be.visible');
  });
});
