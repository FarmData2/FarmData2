// Cypress E2E tests for Soil Disturbance selector visibility scenarios

describe('Soil Disturbance: Selector visibility scenarios', () => {
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

  it('Shows only ActivePlantAssetPicklist for location ALF', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('be.visible');
    cy.get('[data-cy="active-plant-asset-bed-picker"]')
      .should('exist')
      .and('be.visible');
    cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
  });

  it('Shows only ActivePlantAssetPicklist for location A', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('be.visible');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should('not.exist');
    cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
  });

  it('Shows only BedSelector in LocationSelector for location H', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="termination-event-group"]').should('not.be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('not.be.visible');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
      'not.be.visible'
    );
    cy.get('[data-cy="location-beds-accordion"]').should('be.visible');
  });

  it('Shows neither BedSelector nor ActivePlantAssetPicklist for location J', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('J');
    cy.get('[data-cy="termination-event-group"]').should('not.be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('not.be.visible');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should('not.exist');
    cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
  });
});
