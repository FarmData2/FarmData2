import * as farmosUtil from './farmosUtil';

describe('Test the harvest log functions', () => {
  let fieldMap = null;
  let bedMap = null;
  let categoryMap = null;
  let unitMap = null;

  function createHarvestRecords() {
    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testing harvest')
    ).as('plantAsset');

    cy.wrap(
      farmosUtil.createStandardQuantity('weight', 5, 'Harvest', 'POUND')
    ).as('quantity');

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createHarvestLog(
          '01/02/1999',
          'ALF',
          ['ALF-1', 'ALF-2'],
          plantAsset,
          [quantity]
        )
      ).as('harvestLog');
    });
  }

  function deletePlantAsset() {
    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.deletePlantAsset(plantAsset.id));
    });
  }

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      bedMap = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    cy.wrap(farmosUtil.getUnitIdToTermMap()).then((map) => {
      unitMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a harvest log', () => {
    createHarvestRecords();

    cy.get('@harvestLog').then((harvestLog) => {
      cy.wrap(farmosUtil.getHarvestLog(harvestLog.id)).as('readHarvestLog');
    });

    cy.getAll(['@readHarvestLog', '@plantAsset', '@quantity']).then(
      ([harvestLog, plantAsset, quantity]) => {
        expect(harvestLog.type).to.equal('log--harvest');
        expect(harvestLog.attributes.name).to.equal('1999-01-02_ha_ARUGULA');
        expect(harvestLog.attributes.timestamp).to.contain('1999-01-02');
        expect(harvestLog.attributes.status).to.equal('done');
        expect(harvestLog.attributes.is_movement).to.equal(false);

        expect(harvestLog.relationships.location).to.have.length(3);
        expect(harvestLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );
        expect(harvestLog.relationships.location[1].id).to.equal(
          bedMap.get('ALF-1').id
        );
        expect(harvestLog.relationships.location[2].id).to.equal(
          bedMap.get('ALF-2').id
        );

        expect(harvestLog.relationships.asset).to.have.length(1);
        expect(harvestLog.relationships.asset[0].id).to.equal(plantAsset.id);

        expect(harvestLog.relationships.category).to.have.length(1);
        expect(harvestLog.relationships.category[0].id).to.equal(
          categoryMap.get('harvest').id
        );

        expect(harvestLog.relationships.quantity).to.have.length(1);
        expect(harvestLog.relationships.quantity[0].id).to.equal(quantity.id);
      }
    );

    cy.get('@harvestLog')
      .then((harvestLog) => {
        cy.wrap(farmosUtil.deleteHarvestLog(harvestLog.id));
      })
      .then(() => {
        deletePlantAsset();
      });
  });

  it('Error creating a harvest log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/harvest', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil.createPlantAsset('1999-01-02', 'ARUGULA', 'testing harvest')
    ).as('plantAsset');

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(
        farmosUtil
          .createHarvestLog('01/02/1999', 'A', [], plantAsset, [])
          .then(() => {
            throw new Error('Creating harvest log should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Request failed with status code 401'
            );
          })
      );
    });

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.deletePlantAsset(plantAsset.id));
    });
  });

  it('Delete a harvest log', () => {
    createHarvestRecords();

    cy.get('@harvestLog')
      .then((harvestLog) => {
        cy.wrap(
          farmosUtil.deleteHarvestLog(harvestLog.id).then((result) => {
            expect(result.status).to.equal(204);
          })
        );
      })
      .then(() => {
        deletePlantAsset();
      });
  });

  it('Error deleting a harvest log', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/log/harvest/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deleteHarvestLog('1234')
        .then(() => {
          throw new Error('Deleting harvest log should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Get the harvest units for a crop with no unit conversions', () => {
    cy.wrap(farmosUtil.getHarvestUnits('ARUGULA')).then((harvestUnits) => {
      expect(harvestUnits).to.have.length(1);
      expect(unitMap.get(harvestUnits[0].id).attributes.name).to.equal('POUND');
    });
  });

  it('Get the harvest units for a crop with one unit conversion', () => {
    cy.wrap(farmosUtil.getHarvestUnits('CARROT')).then((harvestUnits) => {
      expect(harvestUnits).to.have.length(2);
      expect(unitMap.get(harvestUnits[0].id).attributes.name).to.equal('BUNCH');
      expect(unitMap.get(harvestUnits[1].id).attributes.name).to.equal('POUND');
      expect(harvestUnits[1].meta.factor).to.equal(1.75);
    });
  });

  it('Get the harvest units for a crop with multiple unit conversions', () => {
    cy.wrap(farmosUtil.getHarvestUnits('BROCCOLI')).then((harvestUnits) => {
      expect(harvestUnits).to.have.length(3);
      expect(unitMap.get(harvestUnits[0].id).attributes.name).to.equal('POUND');
      expect(unitMap.get(harvestUnits[1].id).attributes.name).to.equal('HEAD');
      expect(harvestUnits[1].meta.factor).to.equal(1);
      expect(unitMap.get(harvestUnits[2].id).attributes.name).to.equal('EACH');
      expect(harvestUnits[2].meta.factor).to.equal(1);
    });
  });

  it('Error getting the harvest units for an unknown crop', () => {
    cy.wrap(
      farmosUtil
        .getHarvestUnits('NOT_A_CROP')
        .then(() => {
          throw new Error('Getting harvest units should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Invalid crop name: NOT_A_CROP');
        })
    );
  });
});
