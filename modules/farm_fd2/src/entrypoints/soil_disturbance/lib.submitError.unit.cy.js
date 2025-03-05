import { lib } from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

function runTest(activePlantAsset) {
  describe(`Test the Soil Disturbance lib submission error with activePlantAsset=${activePlantAsset}`, () => {
    let plantAssets = [];
    let movementLogs = [];
    let form = {
      date: '1950-01-02',
      location: 'ALF',
      beds: [],
      termination: true,
      picked: new Map(),
      affectedPlants: [],
      equipment: ['Tractor', 'Rake'],
      depth: 5,
      speed: 6,
      passes: 2,
      area: 100,
      comment: 'A comment',
    };

    function createPlantAsset(name, type, date, alias) {
      return cy
        .wrap(farmosUtil.createPlantAsset(date, type, name))
        .as(alias)
        .then((plantAsset) => {
          plantAssets.push(plantAsset); // storing for deletion later
          return plantAsset;
        });
    }

    function createMovementLog(
      plantAsset,
      locations,
      categories,
      timestamp,
      alias
    ) {
      const locationsArrayPromise =
        farmosUtil.getPlantingLocationObjects(locations);
      const logCategoriesPromise = farmosUtil.getLogCategoryObjects(categories);

      cy.wrap(Promise.all([locationsArrayPromise, logCategoriesPromise])).then(
        ([locationsArray, logCategoriesArray]) => {
          const logName = `${timestamp}_activity_log_${plantAsset.id}`;
          const activityLogData = {
            type: 'log--activity',
            attributes: {
              name: logName,
              timestamp: `${timestamp}T00:00:00Z`,
              status: 'done',
              is_movement: true,
            },
            relationships: {
              location: locationsArray,
              asset: [{ type: 'asset--plant', id: plantAsset.id }],
              category: logCategoriesArray,
            },
          };

          const activityLog = farmosUtil
            .getFarmOSInstance()
            .then((farm) => farm.log.send(farm.log.create(activityLogData)));

          cy.wrap(activityLog).as(alias);

          cy.get(`@${alias}`).then((activityLog) => {
            movementLogs.push(activityLog); // storing log for deletion later
            expect(activityLog.attributes.name).to.contain('activity_log');
            expect(activityLog.attributes.status).to.equal('done');
            expect(activityLog.attributes.is_movement).to.be.true;
          });
        }
      );
    }

    function cleanupLogsAndAssets(movementLogs, plantAssets) {
      // Delete movement logs
      cy.then(() => {
        return Cypress.Promise.mapSeries(movementLogs, (log) => {
          return farmosUtil
            .getFarmOSInstance()
            .then((farm) => farm.log.delete('activity', log.id))
            .then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });
        });
      })
        // Delete plant assets
        .then(() => {
          return Cypress.Promise.mapSeries(plantAssets, (asset) => {
            return farmosUtil.deletePlantAsset(asset.id).then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });
          });
        })
        // Reset arrays after cleanup
        .then(() => {
          movementLogs.length = 0;
          plantAssets.length = 0;
        });
    }

    before(() => {
      if (activePlantAsset) {
        createPlantAsset(
          'Test Plant Asset 1',
          'HERB-CILANTRO',
          '2023-11-20',
          'newPlantAsset1'
        ).then(() => {
          return cy.get('@newPlantAsset1').then((plantAsset) => {
            createMovementLog(
              plantAsset,
              ['ALF', 'ALF-1', 'ALF-3'],
              ['seeding', 'tillage'],
              '2023-11-20',
              'activityLog1'
            );

            const value1 = {
              row: {
                crop: 'HERB-CILANTRO',
                bed: 'ALF-1',
                timestamp: '2023-11-20',
                uuid: plantAsset.id,
                location: 'ALF',
                created_by: 'seeding, seeding_direct',
              },
              picked: 1,
            };

            const value2 = {
              row: {
                crop: 'HERB-CILANTRO',
                bed: 'ALF-3',
                timestamp: '2023-11-20',
                uuid: plantAsset.id,
                location: 'ALF',
                created_by: 'seeding, seeding_direct',
              },
              picked: 1,
            };

            form.picked.set(0, value1);
            form.picked.set(1, value2);
          });
        });
      } else {
        form.beds.push('ALF-1');
        form.beds.push('ALF-3');
      }
    });

    beforeEach(() => {
      cy.restoreLocalStorage();
      cy.restoreSessionStorage();
    });

    afterEach(() => {
      cy.saveLocalStorage();
      cy.saveSessionStorage();
    });

    after(() => {
      cleanupLogsAndAssets(movementLogs, plantAssets);
    });

    it(
      'Soil Disturbance: records are deleted if there is a submission error',
      { retries: 0 },
      () => {
        if (activePlantAsset) {
          // Counter to track the number of activity logs
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
          }).as('actPost');

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
                console.error(error.message);
                expect(error.message).to.contain(
                  'Error creating Soil Disturbance records.'
                );
                expect(error.message).to.contain(
                  'Result of operation terminationLog0 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation depthQuantity0 0 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation speedQuantity0 0 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation areaQuantity0 0 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation activityLog0 0 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation depthQuantity0 1 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation speedQuantity0 1 could not be cleaned up.'
                );
                expect(error.message).to.contain(
                  'Result of operation areaQuantity0 1 could not be cleaned up.'
                );

                expect(standardQuantityDeletes).to.equal(6);

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
        } else {
          // Counter to track the number of activity logs
          let postRequestCount = 0;

          cy.intercept('POST', '**/api/log/activity', (req) => {
            postRequestCount += 1;
            if (postRequestCount === 2) {
              req.reply({
                statusCode: 401,
              });
            } else {
              // Continue with the request normally for other requests
              req.continue();
            }
          }).as('actPost');

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

                expect(standardQuantityDeletes).to.equal(6);

                /* The last log-activity POST request cannot be undone because it fails
                 * before completing, meaning no record is created that requires deletion.
                 * Cleanup only applies to successfully created records.
                 * As a result, activityLogDeletes does not include the last request
                 * in the count since it was never successfully created and thus not deleted.
                 */
                expect(activityLogDeletes).to.equal(1);
              }),
            { timeout: 10000 }
          );
        }
      }
    );
  });
}

runTest(false);
runTest(true);
