import * as farmosUtil from '../../../../../library/farmosUtil/farmosUtil.js';

describe('Direct Seeding: Submission tests', () => {
  let cropMap = null;
  let fieldMap = null;
  let equipMap = null;
  let bedMap = null;
  let valuesMap = null;
  let maps = new Map();

  before(() => {
    // get maps
    let cropPromoise = farmosUtil.getCropNameToTermMap();
    let fieldPromise = farmosUtil.getFieldNameToAssetMap();
    let equipmentPromise = farmosUtil.getEquipmentNameToAssetMap();
    let bedPromise = farmosUtil.getBedNameToAssetMap();

    valuesMap = new Map();
    valuesMap.set('Bed Feet', '200');
    valuesMap.set('Rows/Bed', '5');
    valuesMap.set('Row Feet', '1000');
    valuesMap.set('Bed Width', '30');
    valuesMap.set('Depth', '6');
    valuesMap.set('Speed', '5');

    let promiseMap = new Map();
    promiseMap.set('crop', cropPromoise);
    promiseMap.set('field', fieldPromise);
    promiseMap.set('equipment', equipmentPromise);
    promiseMap.set('bed', bedPromise);

    return promiseMap.forEach((values, keys) =>
      values.then((map) => {
        maps.set(keys, map);
      })
    );
  });

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
    /*
     * Create a spy to watch for the activity log created by the
     * lib.submitForm function that is called when the "Submit"
     * button is clicked.
     */
    cy.intercept('POST', '**/api/asset/plant', (req) => {
      // check plant name
      cropMap = maps.get('crop');
      let cropID = cropMap.get('ARUGULA').id;
      expect(req.body.data.relationships.plant_type.data[0].id).to.eq(cropID);
    }).as('submitSpy');

    cy.intercept('POST', '**/api/log/activity', (req) => {
      // check plant location
      fieldMap = maps.get('field');
      bedMap = maps.get('bed');

      let fieldArray = req.body.data.relationships.location.data;
      let fieldIdALF = fieldMap.get('ALF').id;
      let fieldIdALF1 = bedMap.get('ALF-1').id;
      let fieldIdALF4 = bedMap.get('ALF-4').id;

      expect(fieldArray[0].id).to.eq(fieldIdALF);
      expect(fieldArray[1].id).to.eq(fieldIdALF1);
      expect(fieldArray[2].id).to.eq(fieldIdALF4);

      // check equipment
      equipMap = maps.get('equipment');
      let equipArray = req.body.data.relationships.equipment.data;
      let tractorID = equipMap.get('Tractor').id;
      expect(equipArray[0].id).to.eq(tractorID);
      expect(req.body.data.attributes.name).to.include('ALF');
      expect(req.body.data.attributes.name).to.include('1950-01-02');
      expect(req.body.data.relationships.location.data.length).to.eq(3);
    }).as('submitSpy');

    cy.intercept('POST', '**/api/quantity/standard', (req) => {
      // intercept standard values {ie. bed feet, rows/bed ...}
      let valueLabel = req.body.data.attributes.label;
      let valueNum = req.body.data.attributes.value.decimal;
      expect(valuesMap.get(valueLabel)).to.eq(valueNum.toString());
    }).as('submitSpy');

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
    //cy.get('@submitSpy').should('be.calledOnce');

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
