import * as farmosUtil from './farmosUtil.js';

describe('Test the getPlantAssets function', () => {
  let bedMap = null;
  let fieldMap = null;
  let greenHouseMap = null;

  before(() => {
    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      bedMap = map;
    });
    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });
    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((map) => {
      greenHouseMap = map;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check that returned plant assets are active', () => {
    const locationName = 'ALF';
    const checkedBeds = ['ALF-1', 'ALF-2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.have.length.greaterThan(0);
        plantAssetIds.forEach((id) => {
          cy.wrap(farmosUtil.getPlantAsset(id)).then((asset) => {
            expect(asset.attributes.status).to.equal('active');
          });
        });
      }
    );
  });

  it('Get plant assets for a specific field and bed', () => {
    const locationName = 'ALF';
    const checkedBeds = ['ALF-1', 'ALF-2'];
    const locIds = [
      fieldMap.get('ALF').id,
      bedMap.get('ALF-1').id,
      bedMap.get('ALF-2').id,
    ];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.have.length.greaterThan(0);
        plantAssetIds.forEach((id) => {
          cy.wrap(farmosUtil.getPlantAsset(id)).then((asset) => {
            const plantLocIds = asset.relationships.location.map(
              (loc) => loc.id
            );
            const containsLocation = plantLocIds.some((plantLocId) => {
              return locIds.includes(plantLocId);
            });
            expect(containsLocation).to.equal(true);
          });
        });
      }
    );
  });

  it('Get plant assets for a specific field without beds', () => {
    const locationName = 'A';
    const locIds = [fieldMap.get('A').id];

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssetIds) => {
      expect(plantAssetIds).to.have.length.greaterThan(0);
      plantAssetIds.forEach((id) => {
        cy.wrap(farmosUtil.getPlantAsset(id)).then((asset) => {
          const plantLocIds = asset.relationships.location.map((loc) => loc.id);
          const containsLocation = plantLocIds.some((plantLocId) => {
            return locIds.includes(plantLocId);
          });
          expect(containsLocation).to.equal(true);
        });
      });
    });
  });

  it('Get plant assets in trays only', () => {
    const locationName = 'CHUAU';
    const locIds = [greenHouseMap.get('CHUAU').id];

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], true, false)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.have.length.greaterThan(0);
        plantAssetIds.forEach((id) => {
          cy.wrap(farmosUtil.getPlantAsset(id)).then((asset) => {
            expect(asset.attributes.inventory[0].units).to.equal('TRAYS');
            const plantLocIds = asset.relationships.location.map(
              (loc) => loc.id
            );
            const containsLocation = plantLocIds.some((plantLocId) => {
              return locIds.includes(plantLocId);
            });
            expect(containsLocation).to.equal(true);
          });
        });
      }
    );
  });

  it('Get plant assets in ground only', () => {
    const locationName = 'CHUAU';
    const locIds = [greenHouseMap.get('CHUAU').id];

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], false, true)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.have.length.greaterThan(0);
        plantAssetIds.forEach((id) => {
          cy.wrap(farmosUtil.getPlantAsset(id)).then((asset) => {
            expect(asset.attributes.inventory[0].units).to.not.equal('TRAYS');
            const plantLocIds = asset.relationships.location.map(
              (loc) => loc.id
            );
            const containsLocation = plantLocIds.some((plantLocId) => {
              return locIds.includes(plantLocId);
            });
            expect(containsLocation).to.equal(true);
          });
        });
      }
    );
  });

  it('Get plant assets with both inTrays and inGround set to false', () => {
    const locationName = 'JASMINE';

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], false, false)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.be.an('array').that.is.empty;
      }
    );
  });

  it('Get plant assets with no matching field asset', () => {
    const locationName = 'NonExistentField';

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssetIds) => {
      expect(plantAssetIds).to.be.an('array').that.is.empty;
    });
  });

  it('Get plant assets with no matching beds', () => {
    const locationName = 'JASMINE';
    const checkedBeds = ['NonExistentBed1', 'NonExistentBed2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        expect(plantAssetIds).to.be.an('array').that.is.empty;
      }
    );
  });
});
