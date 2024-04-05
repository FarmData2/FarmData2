import * as farmosUtil from './farmosUtil';

describe('Test the transplanting activity log functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it.only('Create a transplanting log for entire tray inventory', () => {
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
          [],
          ['seeding', 'seeding_tray'],
          plantAsset,
          [quantity]
        )
      ).as('seedingLog');
    });

    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(farmosUtil.getPlantAsset(plantAsset.id)).as('readPlantAsset');
    });

    cy.get('@readPlantAsset').then((pa) => {
      cy.task('logObject', pa);
    });

    //expect(true).to.be.false;

    // create a tray seeding.
    // transplant the seedlings.

    // check that the log was created
    // check log categories
    // check quantities

    // check that locations are set.
  });

  it('Create a transplanting log for part of trays inventory', () => {
    expect(true).to.be.false;

    // check that greenhouse not removed from asset location.
    // check that field / beds are added to asset location.
  });

  it('Second transplant operation on the same asset', () => {
    expect(true).to.be.false;

    // check that greenhouse removed from asset location.
    // check that field / beds are added to asset location.
  });

  it('Error creating a transplanting log', () => {
    expect(true).to.be.false;
  });

  it('Delete a transplanting log', () => {
    expect(true).to.be.false;
  });

  it('Error deleting a transplanting log', () => {
    expect(true).to.be.false;
  });
});
