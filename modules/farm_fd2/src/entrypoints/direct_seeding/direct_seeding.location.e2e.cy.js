describe('Direct Seeding: Location Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/direct_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Location exists, is visible, is enabled', () => {
    cy.get('[data-cy="direct-seeding-location"]').should('exist');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Location props are correct', () => {
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Location contains only fields and beds.', () => {
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .find('option')
      .should('have.length', 22);
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-option-1"]')
      .should('have.value', 'A');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-option-21"]')
      .should('have.value', 'GHANA-4');
  });

  it('Location validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-invalid');
  });
});
