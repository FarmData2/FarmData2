import { lib } from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

function runTest(activePlantAsset, terminationValue) {
  describe(`Test the Soil Disturbance lib submission with activePlantAssets=${activePlantAsset} termination=${terminationValue}`, () => {
    // Skip the test if the configuration is invalid
    if (!activePlantAsset && terminationValue) {
      // Can't terminate without an active plant asset involved
      it('Should catch invalid configuration and mark as complete', () => {
        throw new Error(
          'Invalid configuration caught: Termination cannot be true without an active plant asset. Marking this test as complete.'
        );
      });
      return;
    }

    let plantAssets = [];
    let movementLogs = [];
    let bedMap = null;
    let categoryMap = null;
    let equipmentMap = null;
    let fieldMap = null;
    let unitMap = null;
    let results = null;
    let form = {
      date: '1950-01-02',
      location: 'ALF',
      beds: [],
      termination: terminationValue,
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
          plantAssets.push(plantAsset); // storing asset for deletion later
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

    function cleanUp(
      results,
      activePlantAsset,
      terminationValue,
      passes,
      movementLogs,
      plantAssets
    ) {
      if (activePlantAsset) {
        Cypress._.times(2, (i) => {
          if (terminationValue) {
            // delete terminationLogs
            cy.wrap(
              farmosUtil.deleteSoilDisturbanceTerminationLog(
                results['terminationLog' + i].id
              )
            ).then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });
          }

          Cypress._.times(passes, (j) => {
            // delete depth quantity
            cy.wrap(
              farmosUtil.deleteStandardQuantity(
                results['depthQuantity' + i + ' ' + j].id
              )
            ).then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });

            // delete area quantity
            cy.wrap(
              farmosUtil.deleteStandardQuantity(
                results['speedQuantity' + i + ' ' + j].id
              )
            ).then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });

            // delete speed quantity
            cy.wrap(
              farmosUtil.deleteStandardQuantity(
                results['areaQuantity' + i + ' ' + j].id
              )
            ).then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });

            // delete soil disturbance activity log
            cy.wrap(
              farmosUtil.deleteSoilDisturbanceActivityLog(
                results['activityLog' + i + ' ' + j].id
              )
            ).then((result) => {
              expect(result.status).to.equal(204); // Successful deletion
            });
          });
        });
        cleanupLogsAndAssets(movementLogs, plantAssets);
      } else {
        Cypress._.times(passes, (i) => {
          // delete depth quantity
          cy.wrap(
            farmosUtil.deleteStandardQuantity(results['depthQuantity' + i].id)
          ).then((result) => {
            expect(result.status).to.equal(204); // Successful deletion
          });

          // delete area quantity
          cy.wrap(
            farmosUtil.deleteStandardQuantity(results['speedQuantity' + i].id)
          ).then((result) => {
            expect(result.status).to.equal(204); // Successful deletion
          });

          // delete speed quantity
          cy.wrap(
            farmosUtil.deleteStandardQuantity(results['areaQuantity' + i].id)
          ).then((result) => {
            expect(result.status).to.equal(204); // Successful deletion
          });

          // delete soil disturbance activity log
          cy.wrap(
            farmosUtil.deleteSoilDisturbanceActivityLog(
              results['activityLog' + i].id
            )
          ).then((result) => {
            expect(result.status).to.equal(204); // Successful deletion
          });
        });
      }
    }

    before(() => {
      cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
        bedMap = map;
      });

      cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
        categoryMap = map;
      });

      cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then((map) => {
        equipmentMap = map;
      });

      cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
        fieldMap = map;
      });

      cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
        unitMap = map;
      });

      if (activePlantAsset) {
        // create first plant asset
        createPlantAsset(
          'Test Plant Asset 1',
          'HERB-CILANTRO',
          '2023-11-20',
          'newPlantAsset1'
        )
          .then(() => {
            // pick all beds for termination
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
              form.affectedPlants.push(plantAsset);
              form.picked.set(0, value1);
              form.picked.set(1, value2);
            });
          })
          .then(() => {
            // create another plant asset and choose specific beds for termination
            return createPlantAsset(
              'Test Plant Asset 2',
              'LETTUCE-MES MIX',
              '2021-11-20',
              'newPlantAsset2'
            ).then(() => {
              return cy.get('@newPlantAsset2').then((plantAsset) => {
                createMovementLog(
                  plantAsset,
                  ['CHUAU', 'CHUAU-1', 'CHUAU-3'],
                  ['seeding', 'tillage'],
                  '2021-11-20',
                  'activityLog2'
                );

                const value3 = {
                  row: {
                    crop: 'HERB-CILANTRO',
                    bed: 'CHUAU-3',
                    timestamp: '2023-11-20',
                    uuid: plantAsset.id,
                    location: 'CHUAU',
                    created_by: 'seeding, seeding_direct',
                  },
                  picked: 1,
                };
                form.affectedPlants.push(plantAsset);
                form.picked.set(2, value3);
              });
            });
          })
          .then(() => {
            // Submit the form after all assets and movement logs are created
            cy.wrap(lib.submitForm(form), { timeout: 60000 }).then(
              (submitted) => {
                results = submitted;
              }
            );
          });
      } else {
        form.beds.push('ALF-1');
        form.beds.push('ALF-3');

        cy.wrap(lib.submitForm(form), { timeout: 60000 }).then((submitted) => {
          results = submitted;
        });
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
      if (activePlantAsset) {
        cleanUp(
          results,
          activePlantAsset,
          terminationValue,
          form.passes,
          movementLogs,
          plantAssets
        );
      } else {
        cleanUp(results, null, false, form.passes, movementLogs, plantAssets);
      }
    });

    if (activePlantAsset) {
      Cypress._.times(2, (i) => {
        if (terminationValue) {
          it('Checks the termination activity--log ' + i, () => {
            expect(results['terminationLog' + i].type).to.equal(
              'log--activity'
            );

            // attributes
            expect(results['terminationLog' + i].attributes.name).to.equal(
              form.date + '_sd_' + plantAssets[i].attributes.name.split('_')[1]
            );
            expect(
              results['terminationLog' + i].attributes.timestamp
            ).to.contain(form.date);
            expect(results['terminationLog' + i].attributes.status).to.equal(
              'done'
            );
            expect(
              results['terminationLog' + i].attributes.is_movement
            ).to.equal(true);

            // location
            if (i == 0) {
              expect(
                results['terminationLog' + i].relationships.location.length
              ).to.equal(1);
              expect(
                results['terminationLog' + i].relationships.location[0].id
              ).to.equal(fieldMap.get(form.location).id);
            } else {
              expect(
                results['terminationLog' + i].relationships.location.length
              ).to.equal(2);
              expect(
                results['terminationLog' + i].relationships.location[0].id
              ).to.equal(fieldMap.get(form.location).id);
              expect(
                results['terminationLog' + i].relationships.location[1].id
              ).to.equal(bedMap.get('CHUAU-1').id);
            }

            // plant assets
            expect(
              results['terminationLog' + i].relationships.asset
            ).to.have.length(1);
            expect(
              results['terminationLog' + i].relationships.asset[0].id
            ).to.equal(plantAssets[i].id);

            // category
            expect(
              results['terminationLog' + i].relationships.category.length
            ).to.equal(1);
            expect(
              results['terminationLog' + i].relationships.category[0].id
            ).to.equal(categoryMap.get('termination').id);
          });
        }

        Cypress._.times(form.passes, (j) => {
          it('Check the depth quantity--standard ' + i + ' ' + j, () => {
            expect(results['depthQuantity' + i + ' ' + j].type).to.equal(
              'quantity--standard'
            );
            expect(
              results['depthQuantity' + i + ' ' + j].attributes.measure
            ).to.equal('length');
            expect(
              results['depthQuantity' + i + ' ' + j].attributes.value.decimal
            ).to.equal(form.depth);
            expect(
              results['depthQuantity' + i + ' ' + j].attributes.label
            ).to.equal('Depth');
            expect(
              results['depthQuantity' + i + ' ' + j].relationships.units.id
            ).to.equal(unitMap.get('INCHES').id);
            expect(
              results['depthQuantity' + i + ' ' + j].relationships
                .inventory_asset
            ).to.be.null;
            expect(
              results['depthQuantity' + i + ' ' + j].attributes
                .inventory_adjustment
            ).to.be.null;
          });

          it('Check the speed quantity--standard ' + i + ' ' + j, () => {
            expect(results['speedQuantity' + i + ' ' + j].type).to.equal(
              'quantity--standard'
            );
            expect(
              results['speedQuantity' + i + ' ' + j].attributes.measure
            ).to.equal('rate');
            expect(
              results['speedQuantity' + i + ' ' + j].attributes.value.decimal
            ).to.equal(form.speed);
            expect(
              results['speedQuantity' + i + ' ' + j].attributes.label
            ).to.equal('Speed');
            expect(
              results['speedQuantity' + i + ' ' + j].relationships.units.id
            ).to.equal(unitMap.get('MPH').id);
            expect(
              results['speedQuantity' + i + ' ' + j].relationships
                .inventory_asset
            ).to.be.null;
            expect(
              results['speedQuantity' + i + ' ' + j].attributes
                .inventory_adjustment
            ).to.be.null;
          });

          it('Check the area quantity--standard ' + i + ' ' + j, () => {
            expect(results['areaQuantity' + i + ' ' + j].type).to.equal(
              'quantity--standard'
            );
            expect(
              results['areaQuantity' + i + ' ' + j].attributes.measure
            ).to.equal('ratio');
            expect(
              results['areaQuantity' + i + ' ' + j].attributes.value.decimal
            ).to.equal(form.area);
            expect(
              results['areaQuantity' + i + ' ' + j].attributes.label
            ).to.equal('Area');
            expect(
              results['areaQuantity' + i + ' ' + j].relationships.units.id
            ).to.equal(unitMap.get('PERCENT').id);
            expect(
              results['areaQuantity' + i + ' ' + j].relationships
                .inventory_asset
            ).to.be.null;
            expect(
              results['areaQuantity' + i + ' ' + j].attributes
                .inventory_adjustment
            ).to.be.null;
          });

          it('Check the soil disturbance log--activity ' + i + ' ' + j, () => {
            expect(results['activityLog' + i + ' ' + j].type).to.equal(
              'log--activity'
            );

            // check attributes
            expect(
              results['activityLog' + i + ' ' + j].attributes.name
            ).to.equal(form.date + '_sd_' + form.location);
            expect(
              results['activityLog' + i + ' ' + j].attributes.timestamp
            ).to.contain(form.date);
            expect(
              results['activityLog' + i + ' ' + j].attributes.status
            ).to.equal('done');
            expect(
              results['activityLog' + i + ' ' + j].attributes.is_movement
            ).to.equal(false);
            expect(
              results['activityLog' + i + ' ' + j].attributes.notes.value
            ).to.equal(
              'Pass ' + (j + 1) + ' of ' + form.passes + '. ' + form.comment
            );

            // check locations
            if (i === 0) {
              expect(
                results['activityLog' + i + ' ' + j].relationships.location
                  .length
              ).to.equal(3);
              expect(
                results['activityLog' + i + ' ' + j].relationships.location[0]
                  .id
              ).to.equal(fieldMap.get(form.location).id);
              expect(
                results['activityLog' + i + ' ' + j].relationships.location[1]
                  .id
              ).to.equal(bedMap.get(form.picked.get(0).row.bed).id);
              expect(
                results['activityLog' + i + ' ' + j].relationships.location[2]
                  .id
              ).to.equal(bedMap.get(form.picked.get(1).row.bed).id);
            } else if (i === 1) {
              expect(
                results['activityLog' + i + ' ' + j].relationships.location
                  .length
              ).to.equal(2);
              expect(
                results['activityLog' + i + ' ' + j].relationships.location[0]
                  .id
              ).to.equal(fieldMap.get(form.location).id);
              expect(
                results['activityLog' + i + ' ' + j].relationships.location[1]
                  .id
              ).to.equal(bedMap.get(form.picked.get(2).row.bed).id);
            }

            // check plant assets
            expect(
              results['activityLog' + i + ' ' + j].relationships.asset
            ).to.have.length(1);
            expect(
              results['activityLog' + i + ' ' + j].relationships.asset[0].id
            ).to.equal(plantAssets[i].id);

            // check category
            if (terminationValue) {
              expect(
                results['activityLog' + i + ' ' + j].relationships.category
                  .length
              ).to.equal(2);
              expect(
                results['activityLog' + i + ' ' + j].relationships.category[0]
                  .id
              ).to.equal(categoryMap.get('tillage').id);
              expect(
                results['activityLog' + i + ' ' + j].relationships.category[1]
                  .id
              ).to.equal(categoryMap.get('termination').id);
            } else {
              expect(
                results['activityLog' + i + ' ' + j].relationships.category
                  .length
              ).to.equal(1);
              expect(
                results['activityLog' + i + ' ' + j].relationships.category[0]
                  .id
              ).to.equal(categoryMap.get('tillage').id);
            }

            // check quantities
            expect(
              results['activityLog' + i + ' ' + j].relationships.quantity.length
            ).to.equal(3);
            expect(
              results['activityLog' + i + ' ' + j].relationships.quantity[0].id
            ).to.equal(results['depthQuantity' + i + ' ' + j].id);
            expect(
              results['activityLog' + i + ' ' + j].relationships.quantity[1].id
            ).to.equal(results['speedQuantity' + i + ' ' + j].id);
            expect(
              results['activityLog' + i + ' ' + j].relationships.quantity[2].id
            ).to.equal(results['areaQuantity' + i + ' ' + j].id);

            // check equipment
            expect(
              results['activityLog' + i + ' ' + j].relationships.equipment
                .length
            ).to.equal(form.equipment.length);
            expect(
              results['activityLog' + i + ' ' + j].relationships.equipment[0].id
            ).to.equal(equipmentMap.get(form.equipment[0]).id);
            expect(
              results['activityLog' + i + ' ' + j].relationships.equipment[1].id
            ).to.equal(equipmentMap.get(form.equipment[1]).id);
          });
        });
      });
    } else {
      // no active plant assets
      Cypress._.times(form.passes, (i) => {
        it('Check the depth quantity--standard ' + i, () => {
          expect(results['depthQuantity' + i].type).to.equal(
            'quantity--standard'
          );
          expect(results['depthQuantity' + i].attributes.measure).to.equal(
            'length'
          );
          expect(
            results['depthQuantity' + i].attributes.value.decimal
          ).to.equal(form.depth);
          expect(results['depthQuantity' + i].attributes.label).to.equal(
            'Depth'
          );
          expect(results['depthQuantity' + i].relationships.units.id).to.equal(
            unitMap.get('INCHES').id
          );
          expect(results['depthQuantity' + i].relationships.inventory_asset).to
            .be.null;
          expect(results['depthQuantity' + i].attributes.inventory_adjustment)
            .to.be.null;
        });

        it('Check the speed quantity--standard ' + i, () => {
          expect(results['speedQuantity' + i].type).to.equal(
            'quantity--standard'
          );
          expect(results['speedQuantity' + i].attributes.measure).to.equal(
            'rate'
          );
          expect(
            results['speedQuantity' + i].attributes.value.decimal
          ).to.equal(form.speed);
          expect(results['speedQuantity' + i].attributes.label).to.equal(
            'Speed'
          );
          expect(results['speedQuantity' + i].relationships.units.id).to.equal(
            unitMap.get('MPH').id
          );
          expect(results['speedQuantity' + i].relationships.inventory_asset).to
            .be.null;
          expect(results['speedQuantity' + i].attributes.inventory_adjustment)
            .to.be.null;
        });

        it('Check the area quantity--standard ' + i, () => {
          expect(results['areaQuantity' + i].type).to.equal(
            'quantity--standard'
          );
          expect(results['areaQuantity' + i].attributes.measure).to.equal(
            'ratio'
          );
          expect(results['areaQuantity' + i].attributes.value.decimal).to.equal(
            form.area
          );
          expect(results['areaQuantity' + i].attributes.label).to.equal('Area');
          expect(results['areaQuantity' + i].relationships.units.id).to.equal(
            unitMap.get('PERCENT').id
          );
          expect(results['areaQuantity' + i].relationships.inventory_asset).to
            .be.null;
          expect(results['areaQuantity' + i].attributes.inventory_adjustment).to
            .be.null;
        });

        it('Check the soil disturbance log--activity ' + i, () => {
          expect(results['activityLog' + i].type).to.equal('log--activity');

          // check attributes
          expect(results['activityLog' + i].attributes.name).to.equal(
            form.date + '_sd_' + form.location
          );
          expect(results['activityLog' + i].attributes.timestamp).to.contain(
            form.date
          );
          expect(results['activityLog' + i].attributes.status).to.equal('done');
          expect(results['activityLog' + i].attributes.is_movement).to.equal(
            false
          );
          expect(results['activityLog' + i].attributes.notes.value).to.equal(
            'Pass ' + (i + 1) + ' of ' + form.passes + '. ' + form.comment
          );

          // check locations
          expect(
            results['activityLog' + i].relationships.location.length
          ).to.equal(3);
          expect(
            results['activityLog' + i].relationships.location[0].id
          ).to.equal(fieldMap.get(form.location).id);
          expect(
            results['activityLog' + i].relationships.location[1].id
          ).to.equal(bedMap.get(form.beds[0]).id);
          expect(
            results['activityLog' + i].relationships.location[2].id
          ).to.equal(bedMap.get(form.beds[1]).id);

          // check plant assets
          expect(results['activityLog' + i].relationships.asset).to.have.length(
            0
          );

          // check category
          expect(
            results['activityLog' + i].relationships.category.length
          ).to.equal(1);
          expect(
            results['activityLog' + i].relationships.category[0].id
          ).to.equal(categoryMap.get('tillage').id);

          // check quantities
          expect(
            results['activityLog' + i].relationships.quantity.length
          ).to.equal(3);
          expect(
            results['activityLog' + i].relationships.quantity[0].id
          ).to.equal(results['depthQuantity' + i].id);
          expect(
            results['activityLog' + i].relationships.quantity[1].id
          ).to.equal(results['speedQuantity' + i].id);
          expect(
            results['activityLog' + i].relationships.quantity[2].id
          ).to.equal(results['areaQuantity' + i].id);

          // check equipment
          expect(
            results['activityLog' + i].relationships.equipment.length
          ).to.equal(form.equipment.length);
          expect(
            results['activityLog' + i].relationships.equipment[0].id
          ).to.equal(equipmentMap.get(form.equipment[0]).id);
          expect(
            results['activityLog' + i].relationships.equipment[1].id
          ).to.equal(equipmentMap.get(form.equipment[1]).id);
        });
      });
    }
  });
}

runTest(false, false); // No active plant asset which implies there is nothing to terminate, so both false
runTest(true, false); // has active plant asset but does not terminate
runTest(true, true); // has active plant asset and terminates beds
