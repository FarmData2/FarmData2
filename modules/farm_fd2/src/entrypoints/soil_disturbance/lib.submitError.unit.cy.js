import { lib } from './lib';
import { lib as directSeedingLib } from '../direct_seeding/lib.js';

describe('Test the Soil Disturbance lib submission error', () => {
  let directSeedingBroccoli = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    rowsPerBed: '3',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    comment: 'A comment',
  };

  let directSeedingBean = {
    seedingDate: '1950-01-02',
    cropName: 'BEAN',
    locationName: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    rowsPerBed: '3',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    comment: 'A comment',
  };

  let form = {
    date: '1950-01-02',
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    termination: true,
    affectedPlants: [],
    equipment: ['Tractor', 'Rake'],
    depth: 5,
    speed: 6,
    passes: 2,
    area: 100,
    comment: 'A comment',
  };

  before(() => {
    cy.wrap(directSeedingLib.submitForm(directSeedingBroccoli), {
      timeout: 10000,
    })
      .then((resultsBroccoli) => {
        form.affectedPlants.push({ uuid: resultsBroccoli.plantAsset.id });
        return cy.wrap(directSeedingLib.submitForm(directSeedingBean), {
          timeout: 10000,
        });
      })
      .then((resultsBean) => {
        form.affectedPlants.push({ uuid: resultsBean.plantAsset.id });
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
    'Soil Disturbance: records are deleted if there is a submission error',
    { retries: 0 },
    () => {
      // Counter to track the number of activity logs
      let postRequestCount = 0;

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
      }).as('actPost');

      let plantAssetPatch = 0;
      cy.intercept('PATCH', '**/api/asset/plant/*', (req) => {
        plantAssetPatch += 1;
        req.continue();
      }).as('plantPatch');

      let standardQuantityDeletes = 0;
      cy.intercept('DELETE', '**/api/quantity/standard/*', (req) => {
        standardQuantityDeletes++;
        req.continue();
      }).as('quantDelete');

      let activityLogDeletes = 0;
      cy.intercept('DELETE', '**/api/log/activity/*', (req) => {
        activityLogDeletes++;
        req.continue();
      }).as('actDelete');

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
            expect(error.message).to.contain(
              'Result of operation affectedPlants could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation depthQuantity0 could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation speedQuantity0 could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation areaQuantity0 could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation activityLog0 could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation depthQuantity1 could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation speedQuantity1 could not be cleaned up.'
            );
            expect(error.message).to.contain(
              'Result of operation areaQuantity1 could not be cleaned up.'
            );

            expect(plantAssetPatch).to.equal(4);
            expect(standardQuantityDeletes).to.equal(6);
            expect(activityLogDeletes).to.equal(1);
          }),
        { timeout: 10000 }
      );
    }
  );
});
