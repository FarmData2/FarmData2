import * as farmosUtil from './farmosUtil';

describe('Test the quantity functions', () => {
  let unitMap = null;

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
      unitMap = map;
    });
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create a quantity without an inventory adjustment', () => {
    cy.wrap(farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS'))
      .then((quantity) => {
        cy.wrap(farmosUtil.getStandardQuantity(quantity.id));
      })
      .then((result) => {
        expect(result.attributes.measure).to.equal('count');
        expect(result.attributes.label).to.equal('testLabel');
        expect(result.attributes.value.decimal).to.equal('7');
        expect(result.relationships.units.id).to.equal(unitMap.get('TRAYS').id);
        expect(result.attributes.inventory_adjustment).to.equal(null);
        expect(result.relationships.inventory_asset).to.equal(null);
      });
  });

  it('Error creating quantity', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/quantity/standard', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
        .then(() => {
          throw new Error('Creating quantity should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Delete a quantity', () => {
    cy.wrap(
      farmosUtil.createStandardQuantity('count', 7, 'testLabel', 'TRAYS')
    ).then((quantity) => {
      cy.wrap(farmosUtil.deleteStandardQuantity(quantity.id)).then((result) => {
        expect(result.status).to.equal(204);
      });
    });
  });

  it('Error deleting quantity', { retries: 4 }, () => {
    cy.intercept('DELETE', '**/api/quantity/standard/*', {
      statusCode: 401,
    });

    cy.wrap(
      farmosUtil
        .deleteStandardQuantity('1234')
        .then(() => {
          throw new Error('Deleting standard quantity should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Create a quantity with an inventory adjustment', () => {
    cy.wrap(
      farmosUtil.createPlantAsset('testPlant', 'ARUGULA', 'testComment')
    ).as('plantAsset');

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(
        farmosUtil.createStandardQuantity(
          'count',
          7,
          'testLabel',
          'TRAYS',
          plantAsset,
          'increment'
        )
      ).as('quantity');
    });

    cy.getAll(['@plantAsset', '@quantity']).then(([plantAsset, quantity]) => {
      cy.wrap(
        farmosUtil.createSeedingLog(
          '01/02/1999',
          'CHUAU',
          ['seeding_tray'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.getAll(['@plantAsset', '@quantity', '@seedingLog']).then(
      ([plantAsset, quantity]) => {
        cy.wrap(farmosUtil.getStandardQuantity(quantity.id)).then((result) => {
          expect(result.attributes.measure).to.equal('count');
          expect(result.attributes.label).to.equal('testLabel');
          expect(result.attributes.value.decimal).to.equal('7');
          expect(result.relationships.units.id).to.equal(
            unitMap.get('TRAYS').id
          );
          expect(result.attributes.inventory_adjustment).to.equal('increment');
          expect(result.relationships.inventory_asset.id).to.equal(
            plantAsset.id
          );
        });

        cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).then(
          (plantWithInventory) => {
            expect(plantWithInventory.attributes.inventory[0].measure).to.equal(
              'count'
            );
            expect(plantWithInventory.attributes.inventory[0].value).to.equal(
              '7'
            );
            expect(plantWithInventory.attributes.inventory[0].units).to.equal(
              'TRAYS'
            );
          }
        );
      }
    );
  });
});
