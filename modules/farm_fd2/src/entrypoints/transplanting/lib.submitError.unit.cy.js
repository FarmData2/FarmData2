import { lib } from './lib.js';
import { lib as traySeedingLib } from '../tray_seeding/lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Error when submitting using the transplanting lib.', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let traySeedingForm = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'CHUAU',
    trays: 25,
    traySize: '200',
    seedsPerCell: 3,
    comment: 'A comment',
  };

  let form = {
    cropName: 'BROCCOLI',
    picked: new Map(),
    transplantingDate: '1950-01-02',
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    bedWidth: 60,
    rowsPerBed: '1',
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    comment: 'A comment',
  };

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(traySeedingLib.submitForm(traySeedingForm), { timeout: 10000 })
      .then(() => {
        return cy.wrap(farmosUtil.getSeedlings(traySeedingForm.cropName), {
          timeout: 10000,
        });
      })
      .then((res) => {
        form.picked.set(0, { trays: 25, data: res[res.length - 1] });
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

  it(
    'Check error messages when cannot clean up excluding soilDisturbance',
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
            expect(error.message).to.contain('Error creating transplanting.');
            expect(error.message).to.contain(
              'Result of operation trayInventoryQuantities could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation transplantingPlantAsset could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation transplantingBedFeetQuantity could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation transplantingRowsPerBedQuantity could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation transplantingRowFeetQuantity could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation transplantingBedWidthQuantity could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation parents could not be cleaned up'
            );

            expect(standardQuantityDeletes).to.equal(5);
            expect(plantAssetDeletes).to.equal(1);
          }),
        { timeout: 10000 }
      );
    }
  );

  it(
    'Check error messages when cannot clean up only for soilDisturbance',
    { retries: 4 },
    () => {
      /*
       * Create a error on submission of the activity log which is the
       * final step.  At that point all other records should have been
       * created and thus should also all be deleted.
       */
      // Counter to track the number of POST requests
      let postRequestCount = 0;

      // Intercept POST requests to the endpoint
      cy.intercept('POST', '**/api/log/activity', (req) => {
        postRequestCount += 1;
        if (postRequestCount === 2) {
          // On the second request, modify the response to have a status code of 401
          req.reply({
            statusCode: 401,
          });
        } else {
          // Continue with the request normally for other requests
          req.continue();
        }
      }).as('postRequest');

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

      cy.wrap(
        lib
          .submitForm(form)
          .then(() => {
            // Shouldn't run because submitForm throws an error.
            throw new Error('The submission should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.contain('Error creating transplanting.');
            expect(error.message).to.contain(
              'Result of operation depthQuantity could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation speedQuantity could not be cleaned up.'
            );
            expect(standardQuantityDeletes).to.equal(2);
          }),
        { timeout: 10000 }
      );
    }
  );
});
