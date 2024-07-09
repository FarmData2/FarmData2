import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Soil Disturbance: Submission tests', () => {
  before(() => {
    cy.task('initDB');
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/soil_disturbance/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  function checkPlantLocation(plantIds) {
    let locationIds = [];

    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      locationIds.push(map.get('ALF-1').id);
      locationIds.push(map.get('ALF-2').id);
    });
    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      locationIds.push(map.get('ALF').id);
    });

    for (const plantId of plantIds) {
      cy.wrap(farmosUtil.getPlantAsset(plantId)).then((plantAsset) => {
        const locations = plantAsset.relationships.location;
        // Check if at least one location ID is in the locationIds array
        const locationFound = locations.some((location) =>
          locationIds.includes(location.id)
        );
        // Assert that the location is found
        expect(locationFound).to.be.true;
      });
    }
  }

  function submitForm() {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
    cy.get('[data-cy="picker-options"]').find('input').eq(1).check();
    cy.get('[data-cy="termination-event-checkbox"]').click();
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .type(5);
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .type(6);
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .type(2);
    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it('Test submission with network error', () => {
    cy.intercept('POST', '**/api/log/activity', {
      statusCode: 401,
    });
    submitForm();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').should('be.disabled');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting Soil Disturbance...');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating Soil Disturbance records.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });

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
      .should('contain.text', 'Submitting Soil Disturbance...');

    /*
     * Give time for all the records to be created and then check
     * for the toast indicating that the submission was successful.
     */
    cy.get('.toast', { timeout: 10000 })
      .should('be.visible')
      .should('contain.text', 'Soil Disturbance created.');

    // Check that submitForm was called with the correct data.
    cy.get('@submitFormSpy').then((spy) => {
      expect(spy).to.be.calledOnce;

      let formData = spy.getCall(0).args[0];
      expect(formData.date).to.equal('1950-01-02');
      expect(formData.location).to.equal('ALF');
      expect(formData.beds[0]).to.equal('ALF-1');
      expect(formData.beds[1]).to.equal('ALF-2');
      expect(formData.termination).to.equal(true);
      expect(formData.affectedPlants).to.have.length(2);
      // check that the affectedPlants are correct
      checkPlantLocation(formData.affectedPlants);
      expect(formData.equipment).to.have.length(1);
      expect(formData.equipment[0]).to.equal('Tractor');
      expect(formData.depth).to.equal(5);
      expect(formData.speed).to.equal(6);
      expect(formData.passes).to.equal(2);
      expect(formData.area).to.equal(50);
      expect(formData.comment).to.equal('test comment');
    });

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null); // non-sticky
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'Tractor');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '5.0');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '6.0');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 2);
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 100); // non-sticky (related to location)
    cy.get('[data-cy="comment-input"]').should('have.value', 'test comment');

    // Check that the success toast is hidden.
    cy.get('.toast').should('not.exist');

    // Check that Submit button is re-enabled after submitting.
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });
});
