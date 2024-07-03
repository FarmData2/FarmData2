import * as farmosUtil from './farmosUtil';

describe('Test the soil disturbance activity log functions', () => {
  let categoryMap = null;
  let greenhouseMap = null;
  let fieldMap = null;
  let bedMap = null;
  let equipmentMap = null;

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((map) => {
      greenhouseMap = map;
    });

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      bedMap = map;
    });

    cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then((map) => {
      equipmentMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a soil disturbance activity log for a field with no plant asset', () => {
    cy.wrap(
      farmosUtil.createStandardQuantity('length', 7, 'Depth', 'INCHES')
    ).as('depthQuantity');

    cy.wrap(farmosUtil.createStandardQuantity('rate', 5, 'Speed', 'MPH')).as(
      'speedQuantity'
    );

    const equipmentArray = [
      equipmentMap.get('Tractor'),
      equipmentMap.get('Planter'),
    ];

    cy.getAll(['@depthQuantity', '@speedQuantity']).then(
      ([depthQuantity, speedQuantity]) => {
        cy.wrap(
          farmosUtil.createSoilDisturbanceActivityLog(
            '1999-01-02',
            'A',
            [],
            ['tillage', 'seeding_direct'],
            null,
            [depthQuantity, speedQuantity],
            equipmentArray,
            'a comment'
          )
        ).as('soilLog');
      }
    );

    cy.getAll(['@depthQuantity', '@speedQuantity', '@soilLog']).then(
      ([depthQuantity, speedQuantity, soilLog]) => {
        cy.wrap(farmosUtil.getSoilDisturbanceActivityLog(soilLog.id)).then(
          (result) => {
            expect(result.type).to.equal('log--activity');
            expect(result.attributes.name).to.equal('1999-01-02_sd_A');
            expect(result.attributes.timestamp).to.contain('1999-01-02');
            expect(result.attributes.status).to.equal('done');
            expect(result.attributes.notes.value).to.equal('a comment');
            expect(result.attributes.is_movement).to.equal(false);

            expect(result.relationships.location[0].id).to.equal(
              fieldMap.get('A').id
            );
            expect(result.relationships.asset).to.be.an('array').that.is.empty;

            expect(result.relationships.category.length).to.equal(2);
            expect(result.relationships.category[0].id).to.equal(
              categoryMap.get('tillage').id
            );
            expect(result.relationships.category[1].id).to.equal(
              categoryMap.get('seeding_direct').id
            );

            expect(result.relationships.quantity.length).to.equal(2);
            expect(result.relationships.quantity[0].id).to.equal(
              depthQuantity.id
            );
            expect(result.relationships.quantity[1].id).to.equal(
              speedQuantity.id
            );
            expect(result.relationships.equipment.length).to.equal(2);
            expect(result.relationships.equipment[0].id).to.equal(
              equipmentArray[0].id
            );
            expect(result.relationships.equipment[1].id).to.equal(
              equipmentArray[1].id
            );
          }
        );
      }
    );
  });

  it('Create a soil disturbance activity log for a field', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('length', 7, 'Depth', 'INCHES')
    ).as('depthQuantity');

    cy.wrap(farmosUtil.createStandardQuantity('rate', 5, 'Speed', 'MPH')).as(
      'speedQuantity'
    );

    const equipmentArray = [
      equipmentMap.get('Tractor'),
      equipmentMap.get('Planter'),
    ];

    cy.getAll(['@plantAsset', '@depthQuantity', '@speedQuantity']).then(
      ([plantAsset, depthQuantity, speedQuantity]) => {
        cy.wrap(
          farmosUtil.createSoilDisturbanceActivityLog(
            '1999-01-02',
            'A',
            [],
            ['tillage', 'seeding_direct'],
            plantAsset,
            [depthQuantity, speedQuantity],
            equipmentArray,
            'a comment'
          )
        ).as('soilLog');
      }
    );

    cy.getAll([
      '@plantAsset',
      '@depthQuantity',
      '@speedQuantity',
      '@soilLog',
    ]).then(([plantAsset, depthQuantity, speedQuantity, soilLog]) => {
      cy.wrap(farmosUtil.getSoilDisturbanceActivityLog(soilLog.id)).then(
        (result) => {
          expect(result.type).to.equal('log--activity');
          expect(result.attributes.name).to.equal('1999-01-02_sd_A');
          expect(result.attributes.timestamp).to.contain('1999-01-02');
          expect(result.attributes.status).to.equal('done');
          expect(result.attributes.notes.value).to.equal('a comment');
          expect(result.attributes.is_movement).to.equal(false);

          expect(result.relationships.location[0].id).to.equal(
            fieldMap.get('A').id
          );
          expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

          expect(result.relationships.category.length).to.equal(2);
          expect(result.relationships.category[0].id).to.equal(
            categoryMap.get('tillage').id
          );
          expect(result.relationships.category[1].id).to.equal(
            categoryMap.get('seeding_direct').id
          );

          expect(result.relationships.quantity.length).to.equal(2);
          expect(result.relationships.quantity[0].id).to.equal(
            depthQuantity.id
          );
          expect(result.relationships.quantity[1].id).to.equal(
            speedQuantity.id
          );
          expect(result.relationships.equipment.length).to.equal(2);
          expect(result.relationships.equipment[0].id).to.equal(
            equipmentArray[0].id
          );
          expect(result.relationships.equipment[1].id).to.equal(
            equipmentArray[1].id
          );
        }
      );
    });
  });

  it('Create a soil disturbance activity log for a Greenhouse w/ beds', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('length', 7, 'Depth', 'INCHES')
    ).as('depthQuantity');

    cy.wrap(farmosUtil.createStandardQuantity('rate', 5, 'Speed', 'MPH')).as(
      'speedQuantity'
    );

    const equipmentArray = [equipmentMap.get('Seeding Drill')];

    cy.getAll(['@plantAsset', '@depthQuantity', '@speedQuantity']).then(
      ([plantAsset, depthQuantity, speedQuantity]) => {
        cy.wrap(
          farmosUtil.createSoilDisturbanceActivityLog(
            '1999-01-02',
            'CHUAU',
            ['CHUAU-1', 'CHUAU-2'],
            ['tillage', 'seeding_direct'],
            plantAsset,
            [depthQuantity, speedQuantity],
            equipmentArray,
            'a comment'
          )
        ).as('soilLog');
      }
    );

    cy.getAll([
      '@plantAsset',
      '@depthQuantity',
      '@speedQuantity',
      '@soilLog',
    ]).then(([plantAsset, depthQuantity, speedQuantity, soilLog]) => {
      cy.wrap(farmosUtil.getSoilDisturbanceActivityLog(soilLog.id)).then(
        (result) => {
          expect(result.type).to.equal('log--activity');
          expect(result.attributes.name).to.equal('1999-01-02_sd_CHUAU');
          expect(result.attributes.timestamp).to.contain('1999-01-02');
          expect(result.attributes.status).to.equal('done');
          expect(result.attributes.notes.value).to.equal('a comment');
          expect(result.attributes.is_movement).to.equal(false);

          expect(result.relationships.location.length).to.equal(3);
          expect(result.relationships.location[0].id).to.equal(
            greenhouseMap.get('CHUAU').id
          );
          expect(result.relationships.location[0].type).to.equal(
            'asset--structure'
          );
          expect(result.relationships.location[1].id).to.equal(
            bedMap.get('CHUAU-1').id
          );
          expect(result.relationships.location[1].type).to.equal('asset--land');
          expect(result.relationships.location[2].id).to.equal(
            bedMap.get('CHUAU-2').id
          );
          expect(result.relationships.location[2].type).to.equal('asset--land');
          expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

          expect(result.relationships.category.length).to.equal(2);
          expect(result.relationships.category[0].id).to.equal(
            categoryMap.get('tillage').id
          );
          expect(result.relationships.category[1].id).to.equal(
            categoryMap.get('seeding_direct').id
          );

          expect(result.relationships.quantity.length).to.equal(2);
          expect(result.relationships.quantity[0].id).to.equal(
            depthQuantity.id
          );
          expect(result.relationships.quantity[1].id).to.equal(
            speedQuantity.id
          );
          expect(result.relationships.equipment.length).to.equal(1);
          expect(result.relationships.equipment[0].id).to.equal(
            equipmentArray[0].id
          );
        }
      );
    });
  });

  it('Error creating soil disturbance activity log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/activity', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(
        farmosUtil
          .createSoilDisturbanceActivityLog(
            '1999-01-02',
            'A',
            [],
            ['tillage'],
            plantAsset
          )
          .then(() => {
            throw new Error(
              'Creating soil disturbance log should have failed.'
            );
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Request failed with status code 401'
            );
          })
      );
    });
  });

  it('Delete a soil disturbance activity log', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(
        farmosUtil.createSoilDisturbanceActivityLog(
          '1999-01-02',
          'A',
          [],
          ['tillage'],
          plantAsset
        )
      ).as('soilLog');
    });

    cy.get('@soilLog').then((soilLog) => {
      cy.wrap(farmosUtil.deleteSoilDisturbanceActivityLog(soilLog.id)).then(
        (result) => {
          expect(result.status).to.equal(204);
        }
      );
    });
  });

  it('Error deleting soil disturbance activity log', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/log/activity/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deleteSoilDisturbanceActivityLog('1234')
        .then(() => {
          throw new Error(
            'Deleting soil disturbance activity log should have failed.'
          );
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });
});
