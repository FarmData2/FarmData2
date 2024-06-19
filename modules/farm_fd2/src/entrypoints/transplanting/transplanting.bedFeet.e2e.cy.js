describe('Transplanting: Bed Feet Component', () => {
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

  it('Bed Feet exists, is visible, is enabled', () => {
    cy.get('[data-cy="transplanting-bed-feet"]').should('exist');
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Bed Feet props are correct', () => {
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
  });

  it('Bed Feet has correct increment/decrement buttons.', () => {
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '101');

    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-increase-md"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '111');

    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-increase-lg"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '211');

    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '111');

    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '101');

    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
  });

  it('Bed Feet has correct minimum value.', () => {
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
  });

  it('Bed Feet validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-valid');
  });
});
