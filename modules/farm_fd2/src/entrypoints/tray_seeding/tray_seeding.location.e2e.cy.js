describe('Tray Seeding: Location Component', () => {
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

  it('Location exists, is visible, is enabled', () => {
    cy.get('[data-cy="tray-seeding-location"]').should('exist');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Location props are correct', () => {
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Location contains only greenhouses.', () => {
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .find('option')
      .should('have.length', 4);
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-option-1"]')
      .should('have.value', 'CHUAU');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-option-3"]')
      .should('have.value', 'JASMINE');
  });

  it('Location validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-invalid');
  });
});
