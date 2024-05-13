describe('example_entry_point: exists and has main page elements.', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2_examples/example_entry_point/');

    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Main page elements exist', () => {
    cy.get('[data-cy="example-entry-point"]').should('exist');
    cy.get('[data-cy="example-entry-point-card"]').should('exist');
    cy.get('[data-cy="example-entry-point-header"]').should('exist');
    cy.get('[data-cy="example-entry-point-header"]').should(
      'contain.text',
      'Example Entry Point'
    );
    cy.get('[data-cy="example-entry-point-form"]').should('exist');
  });
});
