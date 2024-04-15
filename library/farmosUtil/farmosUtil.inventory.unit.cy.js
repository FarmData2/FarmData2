import * as farmosUtil from './farmosUtil.js';

describe('Test the getAssetInventory function', () => {
  beforeEach(async () => {
    const farm = await farmosUtil.getFarmOSInstance();

    cy.wrap(
      farm.asset.create({
        type: 'asset--plant',
        attributes: {
          name: 'testAsset',
          status: 'active',
          inventory: [
            {
              measure: 'speed',
              value: 1,
              units: 'MPH',
            },
            {
              measure: 'length',
              value: 3,
              units: 'FEET',
            },
            {
              measure: 'count',
              value: 2,
              units: 'TRAYS',
            },
          ],
        },
      })
    ).as('asset');
  });

  it('Get an existing inventory', () => {
    cy.get('@asset').then((asset) => {
      expect(asset.attributes.inventory).to.have.length(3);
      const trays = farmosUtil.getAssetInventory(asset, 'count', 'TRAYS');
      expect(trays).to.equal(2);
      const feet = farmosUtil.getAssetInventory(asset, 'length', 'FEET');
      expect(feet).to.equal(3);
      const mph = farmosUtil.getAssetInventory(asset, 'speed', 'MPH');
      expect(mph).to.equal(1);
    });
  });

  it('Get a non-existing inventory due to measure', () => {
    cy.get('@asset').then((asset) => {
      expect(asset.attributes.inventory).to.have.length(3);
      const trays = farmosUtil.getAssetInventory(asset, 'length', 'TRAYS');
      expect(trays).to.equal(null);
      const feet = farmosUtil.getAssetInventory(asset, 'speed', 'FEET');
      expect(feet).to.equal(null);
      const mph = farmosUtil.getAssetInventory(asset, 'count', 'MPH');
      expect(mph).to.equal(null);
    });
  });

  it('Get a non-existing inventory due to units', () => {
    cy.get('@asset').then((asset) => {
      expect(asset.attributes.inventory).to.have.length(3);
      const one = farmosUtil.getAssetInventory(asset, 'count', 'FEET');
      expect(one).to.equal(null);
      const two = farmosUtil.getAssetInventory(asset, 'length', 'MPH');
      expect(two).to.equal(null);
      const three = farmosUtil.getAssetInventory(asset, 'speed', 'TRAYS');
      expect(three).to.equal(null);
    });
  });

  it('Get a non-existing inventory due to both', () => {
    cy.get('@asset').then((asset) => {
      expect(asset.attributes.inventory).to.have.length(3);
      const none = farmosUtil.getAssetInventory(asset, 'blah', 'blah');
      expect(none).to.equal(null);
    });
  });
});
