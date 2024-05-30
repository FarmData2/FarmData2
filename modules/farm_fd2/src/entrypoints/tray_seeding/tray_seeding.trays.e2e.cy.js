describe('Tray Seeding: Number of Trays Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/tray_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Number of trays exists, is visible, is enabled', () => {
    cy.get('[data-cy="tray-seeding-trays"]').should('exist');
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Number of trays props are correct', () => {
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');
  });

  it('Bed width has correct increment/decrement buttons.', () => {
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '2.00');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-increase-md"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '7.00');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-increase-lg"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '17.00');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '7.00');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '2.00');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');
  });

  it('Number of trays has correct minimum value.', () => {
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.01');
  });

  it('Number of trays validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-valid');
  });
});
