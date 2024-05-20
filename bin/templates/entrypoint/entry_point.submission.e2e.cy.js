describe('%ENTRY_POINT_TITLE%: Submission tests', () => {
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

  function submitForm() {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');

    /*
     * TODO: Add code to fill in values for other fields as they
     * are added to the input form.
     */

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it('Test successful submission', () => {
    /*
     * TODO: Customize this spy to watch for the last log
     * or asset created by the lib.submitForm function that
     * is called when the "Submit" button is clicked.
     */
    cy.intercept('POST', '**/api/*', cy.spy().as('submitSpy'));

    /*
     * Fill in the form and click the "Submit" button.
     */
    submitForm();

    // Check for the status toast while the form is submitting.
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting %ENTRY_POINT_TITLE%...');

    // Give time for all the records to be created.
    cy.get('.toast', { timeout: 10000 }).should(
      'contain.text',
      '%ENTRY_POINT_TITLE% created.'
    );

    /*
     * Ensure that the lib.submitForm function was called.
     * No need to check the db for the records as the lib unit tests
     * already do that.
     */
    cy.get('@submitSpy').should('be.called');

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');

    // Check that the other parts of the form are reset.
    cy.get('[data-cy="comment-input"]').should('have.value', '');

    /*
     * TODO: Add checks above for the other parts of the form as they
     * are added to the input form.
     */

    // Finally check that the toast is hidden.
    cy.get('.toast').should('not.exist');
  });

  it('Test submission with network error', () => {
    /*
     * TODO: Customize this spy to watch for the last log
     * or asset created by the lib.submitForm function that
     * is called when the "Submit" button is clicked.
     */

    cy.intercept('POST', '**/api/*', {
      statusCode: 401,
    });

    submitForm();

    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting %ENTRY_POINT_TITLE%...');

    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating %ENTRY_POINT_TITLE% records.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');
  });
});
