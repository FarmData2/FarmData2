import * as farmosUtil from './farmosUtil';

describe('Test the soil disturbance termination log functions', () => {
  let fieldMap = null;
  let cropMap = null;
  let bedMap = null;
  let categoryMap = null;

  function createPlantAsset(name, type, date) {
    return cy
      .wrap(farmosUtil.createPlantAsset(date, type, name))
      .as('newPlantAsset');
  }

  function createMovementLog(plantAsset, locations, categories, timestamp) {
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

        cy.wrap(activityLog).as('createdActivityLog');

        cy.get('@createdActivityLog').then((activityLog) => {
          expect(activityLog.attributes.name).to.contain('activity_log');
          expect(activityLog.attributes.status).to.equal('done');
          expect(activityLog.attributes.is_movement).to.be.true;
        });
      }
    );
  }

  function cleanupLogsAndAsset({
    deleteSoilDisturbanceLog = false,
    deleteMovementLog = false,
    deletePlantAsset = false,
  } = {}) {
    if (deleteSoilDisturbanceLog) {
      cy.get('@soilDisturbanceLog').then((soilDisturbanceLog) => {
        cy.wrap(
          farmosUtil.deleteSoilDisturbanceTerminationLog(soilDisturbanceLog.id)
        ).then((result) => {
          expect(result.status).to.equal(204); // Successful deletion
        });
      });
    }

    if (deleteMovementLog) {
      cy.get('@createdActivityLog').then((movementLog) => {
        cy.wrap(
          farmosUtil
            .getFarmOSInstance()
            .then((farm) => farm.log.delete('activity', movementLog.id))
        ).then((result) => {
          expect(result.status).to.equal(204); // Successful deletion
        });
      });
    }

    if (deletePlantAsset) {
      cy.get('@newPlantAsset').then((plantAsset) => {
        cy.wrap(farmosUtil.deletePlantAsset(plantAsset.id)).then((result) => {
          expect(result.status).to.equal(204); // Successful deletion
        });
      });
    }
  }

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getCropIdToTermMap()).then((map) => {
      cropMap = map;
    });

    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      bedMap = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a soil disturbance termination log for specific beds', () => {
    createPlantAsset('Test Plant Asset', 'HERB-CILANTRO', '2023-11-20');

    cy.get('@newPlantAsset').then((plantAsset) => {
      createMovementLog(
        plantAsset,
        ['ALF', 'ALF-1', 'ALF-3'],
        ['seeding', 'tillage'],
        '2023-11-20'
      );
    });

    // Create the soil disturbance termination log for a specific bed
    cy.get('@newPlantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
        (updatedPlantAsset) => {
          cy.wrap(
            farmosUtil.createSoilDisturbanceTerminationLog(
              '2023-11-20',
              'ALF',
              ['ALF-1'], // Terminating ALF-1 only
              updatedPlantAsset // Use the updated plant asset
            )
          ).as('soilDisturbanceLog');
        }
      );
    });

    // Validate the soil disturbance termination log
    cy.get('@soilDisturbanceLog').then((soilDisturbanceLog) => {
      cy.wrap(
        farmosUtil.getSoilDisturbanceTerminationLog(soilDisturbanceLog.id)
      ).as('readSoilDisturbanceLog');
    });

    cy.getAll(['@readSoilDisturbanceLog', '@newPlantAsset']).then(
      ([soilDisturbanceLog, plantAsset]) => {
        expect(soilDisturbanceLog.attributes.name).to.equal(
          '2023-11-20_sd_' +
            plantAsset.relationships.plant_type
              .map((crop) => cropMap.get(crop.id).attributes.name)
              .join('_')
        );
        expect(soilDisturbanceLog.attributes.timestamp).to.contain(
          '2023-11-20'
        );
        expect(soilDisturbanceLog.type).to.equal('log--activity');
        expect(soilDisturbanceLog.attributes.status).to.equal('done');
        expect(soilDisturbanceLog.attributes.is_movement).to.equal(true);
        expect(soilDisturbanceLog.attributes.notes.value).to.equal(
          'Terminated plants in bed ALF-1.'
        );

        expect(soilDisturbanceLog.relationships.location).to.have.length(2);
        expect(soilDisturbanceLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );
        expect(soilDisturbanceLog.relationships.location[1].id).to.equal(
          bedMap.get('ALF-3').id
        ); // ALF-3 remains as it wasn't terminated

        expect(soilDisturbanceLog.relationships.asset).to.have.length(1);
        expect(soilDisturbanceLog.relationships.asset[0].id).to.equal(
          plantAsset.id
        );

        expect(soilDisturbanceLog.relationships.category).to.have.length(1);
        expect(soilDisturbanceLog.relationships.category[0].id).to.equal(
          categoryMap.get('termination').id
        );
      }
    );

    // Re-fetch the plant asset associated with the log and ensure the correct beds were removed for the plant asset
    cy.get('@readSoilDisturbanceLog').then((soilDisturbanceLog) => {
      cy.wrap(
        farmosUtil.getPlantAsset(soilDisturbanceLog.relationships.asset[0].id)
      ).then((updatedPlantAsset) => {
        expect(updatedPlantAsset.relationships.location).to.have.length(2);
        expect(updatedPlantAsset.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );
        expect(updatedPlantAsset.relationships.location[1].id).to.equal(
          bedMap.get('ALF-3').id
        ); // ALF-3 remains as it wasn't terminated
      });
    });

    // Delete all logs and plant Asset
    cleanupLogsAndAsset({
      deleteSoilDisturbanceLog: true,
      deleteMovementLog: true,
      deletePlantAsset: true,
    });
  });

  it('Archive the plant asset when all beds are terminated', () => {
    createPlantAsset(
      'Test Plant Asset for Archiving',
      'HERB-CILANTRO',
      '2023-11-20'
    );

    cy.get('@newPlantAsset').then((plantAsset) => {
      createMovementLog(
        plantAsset,
        ['ALF', 'ALF-1', 'ALF-3'],
        ['seeding', 'tillage'],
        '2023-11-20'
      );
    });

    // Create the soil disturbance termination log for all beds
    cy.get('@newPlantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
        (updatedPlantAsset) => {
          cy.wrap(
            farmosUtil.createSoilDisturbanceTerminationLog(
              '2023-11-20',
              'ALF',
              ['ALF-1', 'ALF-3'], // Terminate all beds
              updatedPlantAsset // Use the updated plant asset
            )
          ).as('soilDisturbanceLog');
        }
      );
    });

    // Validate the soil disturbance termination log
    cy.get('@soilDisturbanceLog').then((soilDisturbanceLog) => {
      cy.wrap(
        farmosUtil.getSoilDisturbanceTerminationLog(soilDisturbanceLog.id)
      ).as('readSoilDisturbanceLog');
    });

    cy.getAll(['@readSoilDisturbanceLog', '@newPlantAsset']).then(
      ([soilDisturbanceLog, plantAsset]) => {
        expect(soilDisturbanceLog.attributes.name).to.equal(
          '2023-11-20_sd_' +
            plantAsset.relationships.plant_type
              .map((crop) => cropMap.get(crop.id).attributes.name)
              .join('_')
        );
        expect(soilDisturbanceLog.attributes.timestamp).to.contain(
          '2023-11-20'
        );
        expect(soilDisturbanceLog.type).to.equal('log--activity');
        expect(soilDisturbanceLog.attributes.status).to.equal('done');
        expect(soilDisturbanceLog.attributes.is_movement).to.be.true;
        expect(soilDisturbanceLog.attributes.notes.value).to.equal(
          'Terminated plants in beds ALF-1, ALF-3.'
        );

        expect(soilDisturbanceLog.relationships.location).to.have.length(1);
        expect(soilDisturbanceLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );

        expect(soilDisturbanceLog.relationships.asset).to.have.length(1);
        expect(soilDisturbanceLog.relationships.asset[0].id).to.equal(
          plantAsset.id
        );

        expect(soilDisturbanceLog.relationships.category).to.have.length(1);
        expect(soilDisturbanceLog.relationships.category[0].id).to.equal(
          categoryMap.get('termination').id
        );
      }
    );

    // Ensure the plant asset in the createSoilDisturbanceTerminationLog is archived
    cy.get('@readSoilDisturbanceLog').then((soilDisturbanceLog) => {
      cy.wrap(
        farmosUtil.getPlantAsset(soilDisturbanceLog.relationships.asset[0].id)
      ).then((updatedAsset) => {
        expect(updatedAsset.attributes.status).to.equal('archived');
        expect(updatedAsset.relationships.location).to.have.length(1); // No beds, only location
      });
    });

    // Delete all logs and plant Asset
    cleanupLogsAndAsset({
      deleteSoilDisturbanceLog: true,
      deleteMovementLog: true,
      deletePlantAsset: true,
    });
  });

  it('Terminates all beds and archives the plant asset if no beds argument is passed', () => {
    createPlantAsset(
      'Test Plant Asset for Archiving',
      'HERB-CILANTRO',
      '2023-11-20'
    );

    cy.get('@newPlantAsset').then((plantAsset) => {
      createMovementLog(
        plantAsset,
        ['ALF', 'ALF-1', 'ALF-3'],
        ['seeding', 'tillage'],
        '2023-11-20'
      );
    });

    // Create the soil disturbance termination log for all beds
    cy.get('@newPlantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
        (updatedPlantAsset) => {
          cy.wrap(
            farmosUtil.createSoilDisturbanceTerminationLog(
              '2023-11-20',
              'ALF',
              [], // Should terminate all beds
              updatedPlantAsset // Use the updated plant asset
            )
          ).as('soilDisturbanceLog');
        }
      );
    });

    // Validate the soil disturbance termination log
    cy.get('@soilDisturbanceLog').then((soilDisturbanceLog) => {
      cy.wrap(
        farmosUtil.getSoilDisturbanceTerminationLog(soilDisturbanceLog.id)
      ).as('readSoilDisturbanceLog');
    });

    cy.getAll(['@readSoilDisturbanceLog', '@newPlantAsset']).then(
      ([soilDisturbanceLog, plantAsset]) => {
        expect(soilDisturbanceLog.attributes.name).to.equal(
          '2023-11-20_sd_' +
            plantAsset.relationships.plant_type
              .map((crop) => cropMap.get(crop.id).attributes.name)
              .join('_')
        );
        expect(soilDisturbanceLog.attributes.timestamp).to.contain(
          '2023-11-20'
        );
        expect(soilDisturbanceLog.type).to.equal('log--activity');
        expect(soilDisturbanceLog.attributes.status).to.equal('done');
        expect(soilDisturbanceLog.attributes.is_movement).to.be.true;

        expect(soilDisturbanceLog.relationships.location).to.have.length(1);
        expect(soilDisturbanceLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );

        expect(soilDisturbanceLog.relationships.asset).to.have.length(1);
        expect(soilDisturbanceLog.relationships.asset[0].id).to.equal(
          plantAsset.id
        );

        expect(soilDisturbanceLog.relationships.category).to.have.length(1);
        expect(soilDisturbanceLog.relationships.category[0].id).to.equal(
          categoryMap.get('termination').id
        );
      }
    );

    // Ensure the plant asset in the createSoilDisturbanceTerminationLog is archived
    cy.get('@readSoilDisturbanceLog').then((soilDisturbanceLog) => {
      cy.wrap(
        farmosUtil.getPlantAsset(soilDisturbanceLog.relationships.asset[0].id)
      ).then((updatedAsset) => {
        expect(updatedAsset.attributes.status).to.equal('archived');
        expect(updatedAsset.relationships.location).to.have.length(1); // No beds, only location
      });
    });

    // Delete all logs and plant Asset
    cleanupLogsAndAsset({
      deleteSoilDisturbanceLog: true,
      deleteMovementLog: true,
      deletePlantAsset: true,
    });
  });

  it('Archive the plant asset with no beds', () => {
    createPlantAsset(
      'Test Plant Asset with No Beds',
      'HERB-CILANTRO',
      '2023-11-20'
    );

    // Create a soil disturbance termination log
    cy.get('@newPlantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
        (updatedPlantAsset) => {
          cy.wrap(
            farmosUtil.createSoilDisturbanceTerminationLog(
              '2023-11-20',
              'A', // Location
              [], // No beds to terminate
              updatedPlantAsset // Use the updated plant asset
            )
          ).as('soilDisturbanceLog');
        }
      );
    });

    // Ensure no soil disturbance termination log was created
    cy.get('@soilDisturbanceLog').should('be.undefined');

    // Ensure the plant asset in the termination log is archived
    cy.get('@newPlantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then((updatedAsset) => {
        expect(updatedAsset.attributes.status).to.equal('archived');
        expect(updatedAsset.relationships.location).to.be.empty;
      });
    });

    // Delete all logs and plant asset
    cleanupLogsAndAsset({
      deleteSoilDisturbanceLog: false,
      deletePlantAsset: true,
    });
  });

  it(
    'Error creating a soil disturbance termination log for terminating beds',
    { retries: 4 },
    () => {
      createPlantAsset(
        'Test Plant Asset with No Beds',
        'HERB-CILANTRO',
        '2023-11-20'
      );

      cy.get('@newPlantAsset').then((plantAsset) => {
        createMovementLog(
          plantAsset,
          ['CHUAU', 'CHUAU-1', 'CHUAU-3'],
          ['seeding', 'tillage'],
          '2023-11-20'
        );
      });

      // Simulate an error while creating the soil disturbance termination log
      cy.intercept('POST', '**/api/log/activity', {
        statusCode: 401,
      });

      cy.get('@newPlantAsset').then((plantAsset) => {
        cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
          (updatedPlantAsset) => {
            cy.wrap(
              farmosUtil
                .createSoilDisturbanceTerminationLog(
                  '2023-11-20',
                  'CHUAU', // Location
                  ['CHUAU-1', 'CHUAU-3'], // beds to terminate
                  updatedPlantAsset
                )
                .then(() => {
                  throw new Error(
                    'Creating soil disturbance log for plant with no beds should have failed.'
                  );
                })
                .catch((error) => {
                  expect(error.message).to.equal(
                    'Request failed with status code 401'
                  );
                })
            );
          }
        );
      });

      // Recheck the plant asset to ensure its state remains intact
      cy.get('@newPlantAsset').then((plantAsset) => {
        cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
          (updatedAsset) => {
            expect(updatedAsset.relationships.location).to.have.length(3); // 2 beds should exist
            expect(updatedAsset.attributes.status).to.not.equal('archived'); // Asset should not be archived
          }
        );
      });

      // Delete the plant asset
      cleanupLogsAndAsset({
        deleteMovementLog: true,
        deletePlantAsset: true,
      });
    }
  );

  it(
    'Error deleting a soil disturbance termination log',
    { retries: 4 },
    () => {
      cy.intercept('DELETE', '**/api/log/activity/*', {
        statusCode: 401,
      });

      cy.wrap(
        farmosUtil
          .deleteSoilDisturbanceTerminationLog('1234')
          .then(() => {
            throw new Error(
              'Deleting soil disturbance log should have failed.'
            );
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Request failed with status code 401'
            );
          })
      );
    }
  );
});
