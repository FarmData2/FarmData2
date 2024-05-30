describe('Tray Seeding: Submission tests', () => {
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

  function submitForm() {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');
    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .type('10');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .select('50');
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .type('3');

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it('Test successful submission', () => {
    /*
     * Setup a spy on the submitForm function in lib.js.  This is
     * the function that is called when the submit button is clicked.
     * The spy will be used to check that the argument passed to the
     * submitForm function contains the expected data from the form.
     *
     * The lib.submit.unit.cy.js function checks that if submitForm
     * is given the correct data that the correct assets, logs and
     * quantities are created, so we do not need to do that here.
     */
    cy.window().then((win) => {
      cy.spy(win.lib, 'submitForm').as('submitFuncSpy');
    });

    /*
     * Fill in the form and click the "Submit" button.
     */
    submitForm();

    // Check that Submit and Reset are disabled while submitting.
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').should('be.disabled');

    // Check for the status toast while the form is submitting.
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting tray seeding...');

    // Give time for all the records to be created.
    cy.get('.toast', { timeout: 10000 }).should(
      'contain.text',
      'Tray seeding created.'
    );

    /*
     * Check that the submitForm function was called with the
     * expected form data.
     */
    cy.get('@submitFuncSpy').then((spy) => {
      let data = spy.getCall(0).args[0];

      expect(data.seedingDate).to.equal('1950-01-02');
      expect(data.cropName).to.equal('ARUGULA');
      expect(data.locationName).to.equal('CHUAU');
      expect(data.trays).to.equal(10);
      expect(data.traySize).to.equal('50');
      expect(data.seedsPerCell).to.equal(3);
      expect(data.comment).to.equal('test comment');
    });

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'CHUAU');

    // Check that the other parts of the form are reset.
    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
    cy.get('[data-cy="comment-input"]').should('have.value', '');

    // Finally check that the toast is hidden.
    cy.get('.toast').should('not.exist');

    // Check that Submit button is re-enabled after submitting.
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });

  it('Test submission with network error', () => {
    cy.intercept('POST', '**/api/log/seeding', {
      statusCode: 401,
    });
    submitForm();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').should('be.disabled');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting tray seeding...');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating tray seeding.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });
});
