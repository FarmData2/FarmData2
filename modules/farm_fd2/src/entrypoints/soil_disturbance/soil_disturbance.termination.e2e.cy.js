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

  it('Selecting location with plants shows termination group', () => {
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

  it('Selecting location and beds with plants shows termination group', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    // Plants in ALF-1 and ALF-2 but none in ALF-3 or ALF-4
    cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(1).check();

    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
  });

  it('Selecting location with some beds with plants and some empty shows termination group', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    // Plants in ALF-1 and ALF-2 but none in ALF-3 or ALF-4
    cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(1).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(2).check();

    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
  });

  it('Selecting empty location causes termination group to not appear', () => {
    // no plants in H.
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
  });

  it('Selecting location with plants but empty bed hides termination group', () => {
    // no plants in ALF-3 or ALF-4, but some in ALF-1 and ALF-2
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="picker-options"]').find('input').eq(2).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(3).check();
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
  });

  it('Switching locations shows/hides termination group', () => {
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
      .select('ALF');
    cy.get('[data-cy="picker-options"]').find('input').eq(2).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(3).check();
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
      .select('ALF');
    cy.get('[data-cy="picker-options"]').find('input').eq(2).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(3).check();
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
  });
});
