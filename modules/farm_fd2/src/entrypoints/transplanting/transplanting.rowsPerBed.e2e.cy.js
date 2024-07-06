describe('Transplanting: Rows/BedComponent', () => {
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

  it('Rows/Bed exists, is visible, is enabled', () => {
    cy.get('[data-cy="transplanting-rows-per-bed"]').should('exist');
    cy.get('[data-cy="transplanting-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Rows/Bed props are correct', () => {
    cy.get('[data-cy="transplanting-rows-per-bed"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="transplanting-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', '1');
  });

  it('Rows/Bed has correct options.', () => {
    for (let i = 1; i <= 10; i++) {
      cy.get('[data-cy="transplanting-rows-per-bed"]')
        .find('[data-cy="selector-option-' + i + '"]')
        .should('have.value', i);
    }
  });

  it('Rows/Bed validity styling works', () => {
    cy.get('[data-cy="transplanting-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('not.have.class', 'is-valid');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="transplanting-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-valid');
  });
});
