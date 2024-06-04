describe('Transplanting: Bed Width Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/transplanting/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Bed Width exists, is visible, is enabled', () => {
    cy.get('[data-cy="transplanting-bed-width"]').should('exist');
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Bed width props are correct', () => {
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '60');
  });

  it('Bed width has correct increment/decrement buttons.', () => {
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '61');

    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-increase-md"]')
      .click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '71');

    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-increase-lg"]')
      .should('not.exist');

    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .should('not.exist');

    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '61');

    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '60');
  });

  it('Bed Width has correct minimum value.', () => {
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '51');
  });

  it('Bed Width validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-valid');
  });
});
