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
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
  });

  it('Selecting valid location causes termination group to appear', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
  });

  it('Selecting invalid location causes termination group to not appear', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
  });

  it('Switching to valid/invalid location causes termination group to appear/disappear', () => {
    //valid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
    //invalid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
    //valid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
    //invalid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
  });
});
