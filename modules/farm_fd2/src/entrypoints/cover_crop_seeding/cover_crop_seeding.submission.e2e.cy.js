describe('Cover Crop Seeding: Submission tests', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/cover_crop_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  function submitForm() {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');

    cy.get('[data-cy="location-selector"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="picker-group"]').find('input').eq(0).check();
    cy.get('[data-cy="picker-group"]').find('input').eq(1).check();

    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');
    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-2"]')
      .find('[data-cy="selector-input"]')
      .select('BEAN');

    cy.get('[data-cy="winter-kill-checkbox"]').check();
    cy.get('[data-cy="winter-kill-date-input"]').type('1951-01-02');

    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-title"]'
    ).click();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('1');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('2');

    cy.get(
      '[data-cy="cover-crop-seeding-seed-incorporation-accordion-title"]'
    ).click();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Portable Broadcaster');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('3');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('4');

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  /*
   * The goal of this test is to check that:
   *   - The submit function in App.vue passes the correct data from the
   *     form to the lib.submit function.
   *   - That the submit function displays appropriate "toast" messages
   *     for the user during the submission.
   *   - That the submit and reset buttons are disabled while the form is
   *     being submitted and that they are re-enabled after the submission
   *     is complete.
   *   - That the form is reset after the submission is complete.
   */
  it('Test successful submission', () => {
    /*
     * Setup a spy for the lib.submitForm function.  This will allow
     * us to check that the form passed to that function from the
     * submit function in App.uve is correct.
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
      .should('contain.text', 'Submitting Cover Crop Seeding...');

    /*
     * Give time for all the records to be created and then check
     * for the toast indicating that the submission was successful.
     */
    cy.get('.toast', { timeout: 10000 })
      .should('be.visible')
      .should('contain.text', 'Cover Crop Seeding created.');

    // Check that submitForm was called with the correct data.
    cy.get('@submitFormSpy').then((spy) => {
      expect(spy).to.be.calledOnce;

      let formData = spy.getCall(0).args[0];
      expect(formData.date).to.equal('1950-01-02');
      expect(formData.location).to.equal('ALF');
      expect(formData.beds).to.have.length(2);
      expect(formData.beds[0]).to.equal('ALF-1');
      expect(formData.beds[1]).to.equal('ALF-2');
      expect(formData.areaSeeded).to.equal(50);
      expect(formData.winterKill).to.equal(true);
      expect(formData.winterKillDate).to.equal('1951-01-02');

      expect(formData.seedApplicationEquipment).to.have.length(1);
      expect(formData.seedApplicationEquipment[0]).to.equal('Tractor');
      expect(formData.seedApplicationDepth).to.equal(1);
      expect(formData.seedApplicationSpeed).to.equal(2);

      expect(formData.seedIncorporationEquipment).to.have.length(1);
      expect(formData.seedIncorporationEquipment[0]).to.equal(
        'Portable Broadcaster'
      );
      expect(formData.seedIncorporationDepth).to.equal(3);
      expect(formData.seedIncorporationSpeed).to.equal(4);

      expect(formData.comment).to.equal('test comment');
    });

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .should('be.checked');
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .should('have.value', '1951-01-02');
    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'ARUGULA');
    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-2"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'BEAN');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'Tractor');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.0');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '2.0');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'Portable Broadcaster');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '3.0');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '4.0');
    cy.get('[data-cy="comment-input"]').should('have.value', 'test comment');

    // Check that the other parts of the form are reset.
    cy.get('[data-cy="location-selector"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="picker-group"]').should('not.exist');
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');

    // Check that the success toast is hidden.
    cy.get('.toast').should('not.exist');

    // Check that Submit button is re-enabled after submitting.
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });

  /*
   * The goal of this test is to check that the form behaves correctly
   * when the lib.submitForm function throws an error. This includes
   * checking that:
   *   - That the submit function displays appropriate "toast" messages
   *     for the user during the submission.
   *   - That the submit and reset buttons are disabled while the form is
   *     being submitted and that they are re-enabled after the submission
   *     is complete.
   */
  it('Test submission with network error', () => {
    cy.intercept('**/api/log/activity', {
      statusCode: 401,
    });

    submitForm();

    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').should('be.disabled');

    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting Cover Crop Seeding...');

    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating Cover Crop Seeding records.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });
});
