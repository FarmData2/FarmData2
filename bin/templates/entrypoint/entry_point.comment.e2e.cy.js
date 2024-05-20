describe('%ENTRY_POINT_TITLE%: Comment Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('%DRUPAL_ROUTE%/');

    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Comment component exists, is visible, is enabled', () => {
    cy.get('[data-cy="%ID_PREFIX%-comment"]').should('exist');
    cy.get('[data-cy="comment-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Comment component should be empty', () => {
    cy.get('[data-cy="comment-input"]').should('have.text', '');
  });
});
