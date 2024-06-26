describe('Soil Disturbance: Equipment Component', () => {
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

  it('Soil disturbance equipment header exists, is visible', () => {
    cy.get('[data-cy="soil-disturbance-equipment-title"]')
      .should('be.visible')
      .should('contain.text', 'Equipment');
  });

  it('Soil disturbance equipment body exists, is visible', () => {
    cy.get('[data-cy="soil-disturbance-equipment-form"]').should('be.visible');
  });

  it('Validity styling shown in soil disturbance component', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('not.have.class', 'is-valid')
      .should('have.class', 'is-invalid');
  });

  it('Proper numeric fields appear when equipment is selected', () => {
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');

    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .should('be.visible');
  });
});
