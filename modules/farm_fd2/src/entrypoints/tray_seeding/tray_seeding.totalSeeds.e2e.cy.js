describe('Tray Seeding: Total Seeds Component', () => {
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

  it('Total Seeds component exists, is visible, is disabled', () => {
    cy.get('[data-cy="tray-seeding-total-seeds"]').should('exist');
    cy.get('[data-cy="text-text"]').should('be.visible').should('be.disabled');
  });

  it('Total Seeds should be empty', () => {
    cy.get('[data-cy="text-text"]').should('have.text', '');
  });
});
