describe('Direct Seeding: Crop Component', () => {
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

  it('Crop exists, is visible, is enabled', () => {
    cy.get('[data-cy="direct-seeding-crop"]').should('exist');
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Crop props are correct', () => {
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Crop validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-invalid');
  });
});
