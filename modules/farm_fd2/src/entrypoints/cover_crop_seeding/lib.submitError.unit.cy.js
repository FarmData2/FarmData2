import { lib } from './lib.js';

describe('Error when submitting using the cover_crop lib.', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the cover_crop entry point. This will be passed
   * to the lib functions as if it is coming from the cover crop
   * entry point as a submission.
   */
  let form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: ['Tractor'],
    seedIncorporationEquipment: ['Rake'],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    winterKill: true,
    winterKillDate: '1950-12-31',
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

  it('Check error messages when cannot clean up', { retries: 4 }, () => {
    // Counter to track the number of POST requests
    let postRequestCount = 0;

    // Intercept POST requests to the endpoint
    cy.intercept('POST', '**/api/log/activity', (req) => {
      postRequestCount += 1;
      if (postRequestCount === 3) {
        // On the third request, modify the response to have a status code of 401
        req.reply({
          statusCode: 401,
        });
      } else {
        // Continue with the request normally for other requests
        req.continue();
      }
    });

    let standardQuantityDeletes = 0;
    cy.intercept('DELETE', '**/api/quantity/standard/*', (req) => {
      standardQuantityDeletes++;
      req.reply({
        statusCode: 401,
      });
    });

    let activityLogDeletes = 0;
    cy.intercept('DELETE', '**/api/log/activity/*', (req) => {
      activityLogDeletes++;
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
          throw new Error('The submission should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.contain(
            'Error creating cover crop seeding records.'
          );
          expect(error.message).to.contain(
            'Result of operation plantAsset could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation areaSeededQuantity could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedingLog could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation winterKillLog could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationDepthQuantity could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationSpeedQuantity could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationAreaQuantity could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationActivityLog could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedIncorporationDepthQuantity could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedIncorporationSpeedQuantity could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedIncorporationAreaQuantity could not be cleaned up.'
          );

          expect(standardQuantityDeletes).to.equal(7);
          expect(seedingLogDeletes).to.equal(1);
          expect(plantAssetDeletes).to.equal(1);
          expect(activityLogDeletes).to.equal(2);
        }),
      { timeout: 10000 }
    );
  });
});
