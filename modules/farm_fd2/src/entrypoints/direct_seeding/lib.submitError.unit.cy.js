import * as lib from './lib.js';

describe('Test error when submitting the direct seeding lib.', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let form = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'A',
    bedFeet: 100,
    rowsPerBed: '1',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    comment: 'A comment',
  };

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it(
    'Records are deleted if there is a submission error',
    { retries: 4 },
    () => {
      /*
       * Create a error on submission of the activity log which is the
       * final step.  At that point all other records should have been
       * created and thus should also all be deleted.
       */
      cy.intercept('POST', '**/api/log/activity', {
        statusCode: 401,
      });

      /*
       * Now create an intercept with a spy for each of the other endpoints
       * where records are being deleted.  We'll then check that each was
       * called the appropriate number of times.
       */
      let standardQuantityDeletes = 0;
      cy.intercept('DELETE', '**/api/quantity/standard/*', (req) => {
        standardQuantityDeletes++;
        req.reply({
          statusCode: 401,
        });
      });

      let seedingLogDeletes = 0;
      cy.intercept('DELETE', '**/api/log/seeding/*', (req) => {
        seedingLogDeletes++;
        req.reply({
          statusCode: 401,
        });
      });

      let plantAssetDeletes = 0;
      cy.intercept('DELETE', '**/api/asset/plant/*', (req) => {
        plantAssetDeletes++;
        req.reply({
          statusCode: 401,
        });
      });

      cy.wrap(
        lib
          .submitForm(form)
          .then(() => {
            // Shouldn't run because submitForm throws an error.
            throw new Error('The submission should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal('Error creating direct seeding.');
            expect(standardQuantityDeletes).to.equal(5);
            expect(seedingLogDeletes).to.equal(1);
            expect(plantAssetDeletes).to.equal(1);
          }),
        { timeout: 10000 }
      );
    }
  );
});
