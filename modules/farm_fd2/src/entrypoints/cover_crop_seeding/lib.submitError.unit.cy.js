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
    seedApplicationPasses: 1,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    seedIncorporationPasses: 1,
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
    // Let all POST requests succeed first, then fail on a PATCH to force cleanup
    let allPostsSucceeded = false;
    let postCount = 0;

    cy.intercept('POST', '**', (req) => {
      postCount++;
      req.continue();
    });

    // After all operations are created, fail the first PATCH to trigger cleanup
    cy.intercept('PATCH', '**', (req) => {
      if (postCount >= 12) {
        // Adjust this number based on expected POST count
        allPostsSucceeded = true;
        req.reply({ statusCode: 401 });
      } else {
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
          console.log('Actual error message:', error.message);
          console.log('POST count:', postCount);
          console.log('All posts succeeded:', allPostsSucceeded);

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
            'Result of operation seedApplicationDepthQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationSpeedQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationAreaQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedApplicationActivityLog0 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedIncorporationDepthQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedIncorporationSpeedQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation seedIncorporationAreaQuantity0 could not be cleaned up.'
          );

          expect(standardQuantityDeletes).to.equal(7);
          expect(seedingLogDeletes).to.equal(1);
          expect(plantAssetDeletes).to.equal(1);
          expect(activityLogDeletes).to.equal(2);
        }),
      { timeout: 30000 }
    );
  });
});
