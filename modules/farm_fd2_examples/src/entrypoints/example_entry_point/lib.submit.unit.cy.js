import { lib } from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the Example Entry Point lib submission', () => {
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

  let submittedObjects = null;
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
     * Example Entry Point.
     */
    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then((results) => {
      /*
       * submittedObjects will be an object containing the log, asset and quantity
       * objects that were submitted to farmOS. These are the objects that farmOS
       * uses to create the logs, assets and quantities. They are not the created
       * objects fetched from the farmOS database.  Each test below will fetch and
       * check the actual objects from the farmOS database.
       */
      submittedObjects = results;
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
   *       the lib.submitForm function. Each test will fetch the the log,
   *       asset or quantity that it is testing from farmOS and compare it
   *       to the expected values.
   *
   *       See examples of tests in the lib.submit.unit.cy.js files in:
   *         - modules/farm_fd2/src/entrypoints/tray_seeding
   *         - modules/farm_fd2/src/entrypoints/direct_seeding
   */
  it('Example Entry Point: Placeholder checks the sampleOp result', () => {
    /*
     * Fetch the plant asset that was created by lib.submitForm function
     * and check that it is as expected for the form that was submitted.
     */
    cy.wrap(farmosUtil.getPlantAsset(submittedObjects.sampleOp.id)).then(
      (plantAsset) => {
        expect(plantAsset.type).to.equal('asset--plant');
        expect(plantAsset.attributes.name).to.equal('1950-01-02_ZUCCHINI');
        expect(plantAsset.attributes.status).to.equal('active');
        expect(plantAsset.attributes.notes.value).to.equal(form.comment);
        expect(plantAsset.relationships.plant_type[0].type).to.equal(
          'taxonomy_term--plant_type'
        );
        expect(plantAsset.relationships.plant_type[0].id).to.equal(
          cropMap.get(form.crop).id
        );

        /**
         * TODO: Add checks for all other attributes of the plant asset
         *       that would be set by the operations in lib.submitForm.  For
         *       example, location due to a movement log or inventory values
         *       set by inventory adjustment quantities, etc.
         */
      }
    );
  });
});
