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

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it('Test successful submission', () => {
    /**
     * Setup a spy on the submitForm function in lib.js, the
     * function that is called when the submit button is clicked.
     * The spy will be used to check that the argument passed to the
     * submitForm function contains the expected data from the form.
     */
    cy.window().then((win) => {
      cy.spy(win.lib, 'submitForm').as('submitFormSpy');
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
      .should('contain.text', 'Submitting direct seeding...');

    // Give time for all the records to be created.
    cy.get('.toast', { timeout: 10000 })
      .should('be.visible')
      .should('contain.text', 'Direct seeding created.');

    /*
     * Check that the submitForm function was called with the
     * expected form data.
     */
    cy.get('@submitFormSpy').then((spy) => {
      expect(spy).to.be.calledOnce;

      let formData = spy.getCall(0).args[0];
      expect(formData.seedingDate).to.equal('1950-01-02');
      expect(formData.cropName).to.equal('ARUGULA');
      expect(formData.locationName).to.equal('ALF');
      expect(formData.bedFeet).to.equal(200);
      expect(formData.rowsPerBed).to.equal('5');
      expect(formData.bedWidth).to.equal(30);
      expect(formData.depth).to.equal(6);
      expect(formData.speed).to.equal(5);
      expect(formData.comment).to.equal('test comment');
    });

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');

    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'ALF');
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

    // Check that the other parts of the form are reset.
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .should('not.be.checked');
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(3)
      .should('not.be.checked');
    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
    cy.get('[data-cy="comment-input"]').should('have.value', '');

    // Check that the toast is hidden.
    cy.get('.toast').should('not.exist');

    // Check that Submit button is re-enabled after submitting.
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });

  it('Test submission with network error', () => {
    cy.intercept('POST', '**/api/log/activity', {
      statusCode: 401,
    });
    submitForm();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').should('be.disabled');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting direct seeding...');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating direct seeding.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });
});
