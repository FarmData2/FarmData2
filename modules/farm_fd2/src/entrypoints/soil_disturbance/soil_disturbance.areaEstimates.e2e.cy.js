describe('Soil Disturbance: Comment Component', () => {
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

  it('Location exists, is visible, is enabled', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="location-beds-accordion"]').should('be.visible');

    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-picklist"]').should('exist');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should('exist');
  });
});
