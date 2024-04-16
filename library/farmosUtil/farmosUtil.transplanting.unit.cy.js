import * as farmosUtil from './farmosUtil';

describe('Test the transplanting activity log functions', () => {
  let fieldMap = null;
  let bedMap = null;
  let categoryMap = null;

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
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a transplanting log for entire tray inventory', () => {
    // Get BROCCOLI tray seedings.
    cy.wrap(farmosUtil.getSeedlings('BROCCOLI')).as('seedlings');

    // Get plant asset for the first BROCCOLI tray seeding
    cy.get('@seedlings').then((seedlings) => {
      cy.wrap(farmosUtil.getPlantAsset(seedlings[0].asset_uuid)).as(
        'seedlingAsset'
      );
    });

    // Create a new plant asset for the transplanted crop
    cy.get('@seedlingAsset').then((seedlingAsset) => {
      cy.wrap(
        farmosUtil.createPlantAsset(
          '1999-01-02',
          'BROCCOLI',
          'testing transplanting',
          [seedlingAsset]
        )
      ).as('transplantAsset');
    });

    // Create quantities for the transplanting log
    cy.getAll(['@transplantAsset', '@seedlingAsset', '@seedlings']).then(
      ([transplantAsset, seedlingAsset, seedlings]) => {
        cy.wrap(
          farmosUtil.createStandardQuantity(
            'length',
            100,
            'Bed Feet',
            'FEET',
            transplantAsset,
            'increment'
          )
        ).as('bedFeetQuantity');

        cy.wrap(
          farmosUtil.createStandardQuantity(
            'count',
            seedlings[0].available_trays,
            'Trays',
            'TRAYS',
            seedlingAsset,
            'decrement'
          )
        ).as('traysQuantity');
      }
    );

    // Create the transplanting log.
    cy.getAll(['@transplantAsset', '@bedFeetQuantity', '@traysQuantity']).then(
      ([transplantAsset, bedFeetQuantity, traysQuantity]) => {
        cy.wrap(
          farmosUtil.createTransplantingActivityLog(
            '01/02/1999',
            'ALF',
            ['ALF-1', 'ALF-2'],
            transplantAsset,
            [bedFeetQuantity, traysQuantity]
          )
        ).as('transplantingLog');
      }
    );

    // Read the transplant log so we get the one on the server.
    cy.get('@transplantingLog').then((transplantingLog) => {
      cy.wrap(farmosUtil.getTransplantingActivityLog(transplantingLog.id)).as(
        'readTransplantingLog'
      );
    });

    // Check the transplant log
    cy.getAll([
      '@readTransplantingLog',
      '@bedFeetQuantity',
      '@traysQuantity',
      '@transplantAsset',
    ]).then(
      ([transplantingLog, bedFeetQuantity, traysQuantity, transplantAsset]) => {
        expect(transplantingLog.attributes.name).to.equal(
          '1999-01-02_xp_BROCCOLI'
        );
        expect(transplantingLog.attributes.timestamp).to.contain('1999-01-02');
        expect(transplantingLog.type).to.equal('log--activity');
        expect(transplantingLog.attributes.status).to.equal('done');
        expect(transplantingLog.attributes.is_movement).to.equal(true);

        expect(transplantingLog.relationships.location).to.have.length(3);
        expect(transplantingLog.relationships.location[0].id).to.equal(
          fieldMap.get('ALF').id
        );
        expect(transplantingLog.relationships.location[1].id).to.equal(
          bedMap.get('ALF-1').id
        );
        expect(transplantingLog.relationships.location[2].id).to.equal(
          bedMap.get('ALF-2').id
        );

        expect(transplantingLog.relationships.asset).to.have.length(1);
        expect(transplantingLog.relationships.asset[0].id).to.equal(
          transplantAsset.id
        );

        expect(transplantingLog.relationships.category).to.have.length(1);
        expect(transplantingLog.relationships.category[0].id).to.equal(
          categoryMap.get('transplanting').id
        );

        expect(transplantingLog.relationships.quantity).to.have.length(2);
        expect(transplantingLog.relationships.quantity[0].id).to.equal(
          bedFeetQuantity.id
        );
        expect(transplantingLog.relationships.quantity[1].id).to.equal(
          traysQuantity.id
        );
      }
    );

    // Re-read the new transplant asset so inventory and location are updated.
    cy.get('@transplantAsset').then((transplantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(transplantAsset.id)).as(
        'readTransplantAsset'
      );
    });

    // Check the new transplant asset for updates to inventory, location
    cy.get('@readTransplantAsset').then((transplantAsset) => {
      expect(transplantAsset.type).to.equal('asset--plant');

      expect(transplantAsset.attributes.name).to.equal('1999-01-02_BROCCOLI');
      expect(transplantAsset.attributes.status).to.equal('active');

      expect(transplantAsset.attributes.inventory).to.have.length(1);
      expect(transplantAsset.attributes.inventory[0].measure).to.equal(
        'length'
      );
      expect(transplantAsset.attributes.inventory[0].value).to.equal('100');
      expect(transplantAsset.attributes.inventory[0].units).to.equal('FEET');

      expect(transplantAsset.relationships.location).to.have.length(3);
      expect(transplantAsset.relationships.location[0].id).to.equal(
        fieldMap.get('ALF').id
      );
      expect(transplantAsset.relationships.location[1].id).to.equal(
        bedMap.get('ALF-1').id
      );
      expect(transplantAsset.relationships.location[2].id).to.equal(
        bedMap.get('ALF-2').id
      );
    });

    // Re-read the original seedling asset so inventory is updated.
    cy.get('@seedlingAsset').then((seedlingAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(seedlingAsset.id)).as(
        'readSeedlingAsset'
      );
    });

    // Check the original asset for update to inventory
    cy.getAll(['@readSeedlingAsset']).then(([seedlingAsset]) => {
      expect(seedlingAsset.type).to.equal('asset--plant');
      expect(seedlingAsset.attributes.inventory).to.have.length(1);
      expect(seedlingAsset.attributes.inventory[0].measure).to.equal('count');
      expect(seedlingAsset.attributes.inventory[0].value).to.equal('0');
      expect(seedlingAsset.attributes.inventory[0].units).to.equal('TRAYS');
    });
  });

  it('Error creating a transplanting log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/activity', {
      statusCode: 401,
    });

    // Create a new plant asset for the transplanted crop
    cy.wrap(
      farmosUtil.createPlantAsset(
        '1999-01-02',
        'BROCCOLI',
        'testing transplanting'
      )
    ).as('transplantAsset');

    // Attempt to create the transplanting log
    cy.get('@transplantAsset').then((transplantAsset) => {
      cy.wrap(
        farmosUtil
          .createTransplantingActivityLog(
            '01/02/1999',
            'A',
            [],
            transplantAsset,
            []
          )
          .then(() => {
            throw new Error('Creating transplanting log should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'Request failed with status code 401'
            );
          })
      );
    });
  });

  it('Delete a transplanting log', () => {
    cy.wrap(
      farmosUtil.createPlantAsset(
        '1999-01-02',
        'BROCCOLI',
        'testing transplanting'
      )
    ).as('transplantAsset');

    // Create the transplanting log
    cy.get('@transplantAsset').then((transplantAsset) => {
      cy.wrap(
        farmosUtil.createTransplantingActivityLog(
          '01/02/1999',
          'A',
          [],
          transplantAsset,
          []
        )
      ).as('transplantingLog');
    });

    cy.get('@transplantingLog').then((transplantingLog) => {
      cy.wrap(
        farmosUtil
          .deleteTransplantingActivityLog(transplantingLog.id)
          .then((result) => {
            expect(result.status).to.equal(204);
          })
      );
    });
  });

  it('Error deleting a transplanting log', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/log/activity/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deleteTransplantingActivityLog('1234')
        .then(() => {
          throw new Error('Deleting transplanting log should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });
});
