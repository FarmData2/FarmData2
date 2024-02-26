describe('Direct Seeding: Submission tests', () => {
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

  function submitForm() {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');

    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .click();
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(3)
      .click();

    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .type('200');
    cy.get('[data-cy="direct-seeding-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="direct-seeding-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .type('30');
    cy.get('[data-cy="direct-seeding-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .select('5');

    cy.get(
      '[data-cy="direct-seeding-soil-disturbance-accordion-title"]'
    ).click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('6');
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('5');
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .type('50');

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it.only('Test successful submission', () => {
    /*
     * Create a spy to watch for the activity log created by the
     * lib.submitForm function that is called when the "Submit"
     * button is clicked.
     */
    cy.intercept('POST', '**/api/log/activity', cy.spy().as('submitSpy'));

    /*
     * Fill in the form and click the "Submit" button.
     */
    submitForm();

    // Check for the status toast while the form is submitting.
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting direct seeding...');

    // Give time for all the records to be created.
    cy.get('.toast', { timeout: 10000 }).should(
      'contain.text',
      'Direct seeding created.'
    );

    /*
     * Ensure that the lib.submitForm function was called.
     * No need to check the db for the records as the lib unit tests
     * already do that.
     */
    cy.get('@submitSpy').should('be.calledOnce');

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');

    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'ALF');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .should('be.checked');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(3)
      .should('be.checked');
    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '200');
    cy.get('[data-cy="direct-seeding-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '30');
    cy.get('[data-cy="direct-seeding-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', '5');

    cy.get(
      '[data-cy="direct-seeding-soil-disturbance-accordion-title"]'
    ).click();
    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'Tractor');
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '6.0');
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '5.0');
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '50');

    // Check that the other parts of the form are reset.
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="comment-input"]').should('have.value', '');

    // Finally check that the toast is hidden.
    cy.get('.toast').should('not.exist');
  });

  it('Test submission with network error', () => {
    cy.intercept('POST', '**/api/log/activity', {
      statusCode: 401,
    });
    submitForm();
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting direct seeding...');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating direct seeding.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');
  });
});
