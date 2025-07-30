describe('Direct Seeding: Termination event group', () => {
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

  it('Termination group does not exist initially', () => {
    cy.get('[data-cy="termination-event-group"]').should('not.visible');
  });

  it('Selecting location shows/hides termination checkbox based on plant existence', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');

    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="termination-event-group"]').should('not.be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.be.visible');
    cy.get('[data-cy="termination-event-label"]').should('not.be.visible');
  });
});
