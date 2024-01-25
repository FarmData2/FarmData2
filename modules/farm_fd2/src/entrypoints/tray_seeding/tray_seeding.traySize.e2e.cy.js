describe('Tray Seeding: Tray Size Component', () => {
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

  it('Tray Size exists, is visible, is enabled', () => {
    cy.get('[data-cy="tray-seeding-tray-size"]').should('exist');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Try Size props are correct', () => {
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Tray size contains sample tray sizes.', () => {
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .find('option')
      .should('have.length', 7);
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-option-1"]')
      .should('have.value', '50');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-option-6"]')
      .should('have.value', '288');
  });

  it('Tray size validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-invalid');
  });
});
