import { lib } from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the Cover Crop Seeding lib submission', () => {
  /*
   * TODO: Create a form object that has the same format as the
   *       data.form object used in the entry point.
   *
   *       This will be passed to the lib functions as if it is
   *       coming from the entry point as a submission.
   */
  let form = {
    date: '1950-01-02',
    crop: 'ZUCCHINI', // Not in the sample form, but needed for testing
    comment: 'A comment',
  };

  let results = null;
  let cropMap = null;
  before(() => {
    /*
     * TODO: Load any maps or other data from the API that will be needed
     *       by the tests.
     *
     *       For examples, see the before() function in lib.submit.unit.cy.js in:
     *         - modules/farm_fd2/src/entrypoints/tray_seeding
     *         - modules/farm_fd2/src/entrypoints/direct_seeding
     */
    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });

    /*
     * Submit the form using lib.submitForm from farmosUtil to create
     * all the logs, assets and quantities needed to represent a
     * Cover Crop Seeding.
     */
    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then((submitted) => {
      /*
       * submitted (and results) is an object containing the log, asset and
       * quantity objects that were submitted to farmOS by the lib.submitForm
       * function. These objects are not the actual objects that exist in the
       * farmOS database, they are the objects sent to farmOS to ask it to create
       * the logs, assets and quantities in its database. The tests below will
       * check that each of the objects in results contains the expected data
       * from the form that was submitted.
       *
       * Note checking the results (and not the database objects) here is sufficient
       * because:
       *   - The *.submission.e2e.cy.js test checks that the correct data
       *     is passed from the user interface to the submitForm function.
       *   - Checking the results here confirms that lib.submitForm has passed the
       *     correct form data to the farmosUtil library functions that create the
       *     logs, assets and quantities in the farmOS database.
       *   - The tests for the farmosUtil library functions confirm that they
       *     create the correct objects in the farmOS database for the data that
       *     they are given.
       *   - We trust that farmOS then handles the additional aspects of creating
       *     the logs, assets and quantities correctly. For example, if we create a
       *     log with a movement, we check that the log references the correct asset.
       *     But we do not check that the location of the asset has been updated.
       */
      results = submitted;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * TODO: Adapt this test and add others as necessary. There should be
   *       One test for each log, asset and quantity that is created by
   *       the lib.submitForm function. Generally, this will be one test
   *       for each operation in lib.submitForm.
   *
   *       The goal of each test is to ensure that the lib.js operation has
   *       passed the correct form data to the farmosUtil function that is
   *       creating the log, asset or quantity.
   *
   *       For example, the sampleOp creates a plant asset. The documentation
   *       for the farmosUtil.createPlantAsset function shows it accepts arguments
   *       for the date, cropName, comment and parents. Thus, the test will
   *       check the parts of the results object that use those parameters to
   *       confirm that they agree with what is expected based on the form data
   *       that was submitted.
   *
   *       See examples of tests in the lib.submit.unit.cy.js files in:
   *         - modules/farm_fd2/src/entrypoints/tray_seeding
   *         - modules/farm_fd2/src/entrypoints/direct_seeding
   */
  it('Cover Crop Seeding: Placeholder checks the sampleOp result', () => {
    /*
     * Check to be sure we get a plant asset.  This confirms that the lib.js
     * operation called the correct function.
     */
    expect(results.sampleOp.type).to.equal('asset--plant');

    /*
     * Check the parts of the result that use the parameters that
     * the lib.js operation passed to the farmosUtil.createPlantAsset
     * function. It is only necessary to do enough checks to be sure
     * that every parameter was passed correctly.  Tests for the
     * farmosUtil functions confirm that they create the correct log,
     * asset, or quantity in the farmOS database.
     */
    expect(results.sampleOp.attributes.name).to.equal(
      form.date + '_' + form.crop
    );
    expect(results.sampleOp.attributes.notes.value).to.equal(form.comment);
    expect(results.sampleOp.relationships.plant_type[0].id).to.equal(
      cropMap.get(form.crop).id
    );
    expect(results.sampleOp.relationships.parent).to.have.length(0);
  });
});
