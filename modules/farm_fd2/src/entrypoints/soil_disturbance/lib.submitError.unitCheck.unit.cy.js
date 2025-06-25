import { lib } from './lib';

describe(`Test the Soil Disturbance lib submission error and ensuring the correct number of deletes are made `, () => {
  let form = {
    date: '1950-01-02',
    location: 'ALF',
    beds: [],
    termination: false,
    picked: new Map(),
    affectedPlants: [],
    equipment: ['Tractor', 'Rake'],
    depth: 5,
    speed: 6,
    passes: 3,
    area: 100,
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

  it('Checking deletes and error messages ', { retries: 4 }, () => {
    let postRequestCount = 0;

    cy.intercept('POST', '**/api/log/activity', (req) => {
      postRequestCount += 1;
      if (postRequestCount === 3) {
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
      req.continue();
    });

    cy.wrap(
      lib
        .submitForm(form)
        .then(() => {
          // Shouldn't run because submitForm throws an error.
          throw new Error('The submission should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.contain(
            'Error creating Soil Disturbance records.'
          );
          expect(error.message).to.not.contain(
            'Result of operation depthQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation speedQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation areaQuantity0 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation activityLog0 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation depthQuantity1 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation speedQuantity1 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation areaQuantity1 could not be cleaned up.'
          );
          expect(error.message).to.not.contain(
            'Result of operation activityLog1 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation depthQuantity2 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation speedQuantity2 could not be cleaned up.'
          );
          expect(error.message).to.contain(
            'Result of operation areaQuantity2 could not be cleaned up.'
          );

          expect(standardQuantityDeletes).to.equal(3);

          /* The last log-activity POST request cannot be undone because it fails
           * before completing, meaning no record is created that requires deletion.
           * Cleanup only applies to successfully created records.
           * As a result, activityLogDeletes does not include the last request
           * in the count since it was never successfully created and thus not deleted.
           */
          expect(activityLogDeletes).to.equal(2);
        }),
      { timeout: 10000 }
    );
  });
});
