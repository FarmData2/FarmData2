describe('Tray Seeding: Seeds/Cell Component', () => {
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

  it('Seeds/Cell exists, is visible, is enabled', () => {
    cy.get('[data-cy="tray-seeding-seeds"]').should('exist');
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Seeds/Cell props are correct', () => {
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
  });

  it('Seeds/Cell has correct increment/decrement buttons.', () => {
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '2');

    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-increase-md"]')
      .should('not.exist');

    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-increase-lg"]')
      .should('not.exist');

    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .should('not.exist');

    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-decrease-md"]')
      .should('not.exist');

    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
  });

  it('Seeds/Cell has correct minimum value.', () => {
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .should('be.disabled');
  });

  it('Seeds/Cell validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-valid');
  });
});
