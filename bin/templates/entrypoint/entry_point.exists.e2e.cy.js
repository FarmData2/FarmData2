describe('%ENTRY_POINT%: exists and has main page elements.', () => {
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

  it('Main page elements exist', () => {
    cy.get('[data-cy="%ID_PREFIX%"]').should('exist');
    cy.get('[data-cy="%ID_PREFIX%-card"]').should('exist');
    cy.get('[data-cy="%ID_PREFIX%-header"]').should('exist');
    cy.get('[data-cy="%ID_PREFIX%-header"]').should(
      'contain.text',
      '%ENTRY_POINT_TITLE%'
    );
    cy.get('[data-cy="%ID_PREFIX%-form"]').should('exist');
  });
});
