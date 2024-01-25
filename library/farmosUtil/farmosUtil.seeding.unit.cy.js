import * as farmosUtil from './farmosUtil';

describe('Test the seeding log functions', () => {
  let greenhouseMap = null;
  let categoryMap = null;
  let fieldMap = null;

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((map) => {
      greenhouseMap = map;
    });

    cy.wrap(farmosUtil.getFieldOrBedNameToAssetMap()).then((map) => {
      fieldMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a tray seeding log', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          ['seeding', 'seeding_tray'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.getAll(['@plantAsset', '@quantity', '@seedingLog']).then(
      ([plantAsset, quantity, seedingLog]) => {
        cy.wrap(farmosUtil.getSeedingLog(seedingLog.id)).then((result) => {
          expect(result.attributes.timestamp).to.contain('1999-01-02');
          expect(result.attributes.purchase_date).to.contain('1999-01-02');

          expect(result.attributes.name).to.equal(plantAsset.attributes.name);

          expect(result.attributes.status).to.equal('done');
          expect(result.attributes.is_movement).to.equal(true);

          expect(result.relationships.category.length).to.equal(2);
          expect(result.relationships.category[0].id).to.equal(
            categoryMap.get('seeding').id
          );
          expect(result.relationships.category[1].id).to.equal(
            categoryMap.get('seeding_tray').id
          );

          expect(result.relationships.location[0].id).to.equal(
            greenhouseMap.get('CHUAU').id
          );
          expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

          expect(result.relationships.quantity.length).to.equal(1);
          expect(result.relationships.quantity[0].id).to.equal(quantity.id);
        });
      }
    );
  });

  it('Create a direct seeding log', () => {
    /*
     * Test this also because it fetches location id from the
     * fields and beds map instead of the greenhouses map.
     */

    cy.wrap(
      farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'A',
          ['seeding', 'seeding_direct'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.getAll(['@plantAsset', '@quantity', '@seedingLog']).then(
      ([plantAsset, quantity, seedingLog]) => {
        console.log(seedingLog);

        cy.wrap(farmosUtil.getSeedingLog(seedingLog.id)).then((result) => {
          expect(result.attributes.timestamp).to.contain('1999-01-02');
          expect(result.attributes.purchase_date).to.contain('1999-01-02');

          expect(result.attributes.name).to.equal(plantAsset.attributes.name);

          expect(result.attributes.status).to.equal('done');
          expect(result.attributes.is_movement).to.equal(true);

          expect(result.relationships.category.length).to.equal(2);
          expect(result.relationships.category[0].id).to.equal(
            categoryMap.get('seeding').id
          );
          expect(result.relationships.category[1].id).to.equal(
            categoryMap.get('seeding_direct').id
          );

          expect(result.relationships.location[0].id).to.equal(
            fieldMap.get('A').id
          );
          expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

          expect(result.relationships.quantity.length).to.equal(1);
          expect(result.relationships.quantity[0].id).to.equal(quantity.id);
        });
      }
    );
  });

  it('Error creating seeding log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/seeding', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(
        farmosUtil
          .createSeedingLog(
            '01/02/1999',
            'CHUAU',
            ['seeding', 'seeding_tray'],
            plantAsset
          )
          .then(() => {
            throw new Error('Creating seeding log should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Request failed with status code 401'
            );
          })
      );
    });
  });

  it('Delete a seeding log', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          ['seeding', 'seeding_tray'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.get('@seedingLog').then((seedingLog) => {
      cy.wrap(farmosUtil.deleteSeedingLog(seedingLog.id)).then((result) => {
        expect(result.status).to.equal(204);
      });
    });
  });

  it('Error deleting seeding log', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/log/seeding/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deleteSeedingLog('1234')
        .then(() => {
          throw new Error('Deleting seeding log should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });
});
