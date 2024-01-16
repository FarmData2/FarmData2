describe('Direct Seeding: Soil Disturbance Speed Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/direct_seeding/');
    cy.waitForPage();

    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]').click();
    cy.get('[data-cy="direct-seeding-equipment-selector"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Disturbance Speed, is visible, is enabled', () => {
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Disturbance Speed props are correct', () => {
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-label"]')
      .should('have.text', 'Speed (mph):');
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
  });

  it('Disturbance Speed has correct increment/decrement buttons', () => {
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.0');

    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-increase-md"]')
      .click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '6.0');

    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-increase-lg"]')
      .should('not.exist');

    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .should('not.exist');

    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.0');

    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
  });

  it('Disturbance speed has correct minimum value', () => {
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
  });

  it('Disturbance Speed validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-valid');
  });
});
