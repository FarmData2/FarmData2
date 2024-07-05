import * as farmosUtil from './farmosUtil';

describe('Test the seeding log functions', () => {
  let greenhouseMap = null;
  let categoryMap = null;
  let fieldMap = null;
  let bedMap = null;

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
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a tray seeding log', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          [],
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

          expect(result.attributes.name).to.equal('1999-01-02_ts_ARUGULA');

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
          expect(result.relationships.location[0].type).to.equal(
            'asset--structure'
          );
          expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

          expect(result.relationships.quantity.length).to.equal(1);
          expect(result.relationships.quantity[0].id).to.equal(quantity.id);
        });
      }
    );
  });

  it('Create a direct seeding log w/ beds', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'ALF',
          ['ALF-1', 'ALF-3'],
          ['seeding', 'seeding_direct'],
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

          expect(result.attributes.name).to.equal('1999-01-02_ds_ARUGULA');

          expect(result.attributes.status).to.equal('done');
          expect(result.attributes.is_movement).to.equal(true);

          expect(result.relationships.category.length).to.equal(2);
          expect(result.relationships.category[0].id).to.equal(
            categoryMap.get('seeding').id
          );
          expect(result.relationships.category[1].id).to.equal(
            categoryMap.get('seeding_direct').id
          );

          expect(result.relationships.location.length).to.equal(3);
          expect(result.relationships.location[0].id).to.equal(
            fieldMap.get('ALF').id
          );
          expect(result.relationships.location[0].type).to.equal('asset--land');
          expect(result.relationships.location[1].id).to.equal(
            bedMap.get('ALF-1').id
          );
          expect(result.relationships.location[1].type).to.equal('asset--land');
          expect(result.relationships.location[2].id).to.equal(
            bedMap.get('ALF-3').id
          );
          expect(result.relationships.location[2].type).to.equal('asset--land');
          expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

          expect(result.relationships.quantity.length).to.equal(1);
          expect(result.relationships.quantity[0].id).to.equal(quantity.id);
        });
      }
    );
  });

  it('Create a cover crop seeding log', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          [],
          ['seeding', 'seeding_cover_crop'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.get('@seedingLog').then((seedingLog) => {
      cy.wrap(farmosUtil.getSeedingLog(seedingLog.id)).then((result) => {
        expect(result.attributes.timestamp).to.contain('1999-01-02');
        expect(result.attributes.purchase_date).to.contain('1999-01-02');

        expect(result.attributes.name).to.equal('1999-01-02_cs_ARUGULA');
      });
    });
  });

  it('Create a seeding log with multiple crops', () => {
    cy.wrap(
      farmosUtil.createPlantAsset(
        '1999-01-02',
        ['BEAN', 'CARROT'],
        'testComment'
      )
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          [],
          ['seeding', 'seeding_cover_crop'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.get('@seedingLog').then((seedingLog) => {
      cy.wrap(farmosUtil.getSeedingLog(seedingLog.id)).then((result) => {
        expect(result.attributes.timestamp).to.contain('1999-01-02');
        expect(result.attributes.purchase_date).to.contain('1999-01-02');

        expect(result.attributes.name).to.equal('1999-01-02_cs_BEAN_CARROT');
      });
    });
  });

  it('Error creating seeding log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/seeding', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(
        farmosUtil
          .createSeedingLog(
            '01/02/1999',
            'CHUAU',
            [],
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
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          [],
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
