import * as farmosUtil from './farmosUtil.js';

describe('Test the bed utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check that returned plant assets are active', () => {
    const locationName = 'SomeField';
    const checkedBeds = ['SomeBed1', 'SomeBed2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        console.log(
          `Location: ${locationName}, Beds: ${checkedBeds}, Plant Asset IDs: ${plantAssetIds}`
        );

        if (plantAssetIds.length > 0) {
          plantAssetIds.forEach((id) => {
            cy.wrap(farmosUtil.getPlantAsset(id)).then((asset) => {
              expect(asset.attributes.status).to.equal('active');
            });
          });
        }
      }
    );
  });

  it('Get plant assets for a specific field and bed', () => {
    const locationName = 'SomeField';
    const checkedBeds = ['SomeBed1', 'SomeBed2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        console.log(
          `Location: ${locationName}, Beds: ${checkedBeds}, Plant Asset IDs: ${plantAssetIds}`
        );

        expect(plantAssetIds).to.be.an('array');
        if (plantAssetIds.length > 0) {
          plantAssetIds.forEach((id) => expect(id).to.be.a('string'));
        }
      }
    );
  });

  it('Get plant assets for a specific field without beds', () => {
    const locationName = 'SomeField';

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssetIds) => {
      console.log(
        `Location: ${locationName}, Plant Asset IDs: ${plantAssetIds}`
      );

      expect(plantAssetIds).to.be.an('array');
      if (plantAssetIds.length > 0) {
        plantAssetIds.forEach((id) => expect(id).to.be.a('string'));
      }
    });
  });

  it('Get plant assets in trays only', () => {
    const locationName = 'SomeField';

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], true, false)).then(
      (plantAssetIds) => {
        console.log(
          `Location: ${locationName}, In Trays Only, Plant Asset IDs: ${plantAssetIds}`
        );

        expect(plantAssetIds).to.be.an('array');
        if (plantAssetIds.length > 0) {
          plantAssetIds.forEach((id) => expect(id).to.be.a('string'));
        }
      }
    );
  });

  it('Get plant assets in ground only', () => {
    const locationName = 'SomeField';

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], false, true)).then(
      (plantAssetIds) => {
        console.log(
          `Location: ${locationName}, In Ground Only, Plant Asset IDs: ${plantAssetIds}`
        );

        expect(plantAssetIds).to.be.an('array');
        if (plantAssetIds.length > 0) {
          plantAssetIds.forEach((id) => expect(id).to.be.a('string'));
        }
      }
    );
  });

  it('Get plant assets with both inTrays and inGround set to false', () => {
    const locationName = 'SomeField';

    cy.wrap(farmosUtil.getPlantAssets(locationName, [], false, false)).then(
      (plantAssetIds) => {
        console.log(
          `Location: ${locationName}, Both In Trays and In Ground False, Plant Asset IDs: ${plantAssetIds}`
        );

        expect(plantAssetIds).to.be.an('array').that.is.empty;
      }
    );
  });

  it('Get plant assets with no matching field asset', () => {
    const locationName = 'NonExistentField';

    cy.wrap(farmosUtil.getPlantAssets(locationName)).then((plantAssetIds) => {
      console.log(
        `Location: ${locationName}, Plant Asset IDs: ${plantAssetIds}`
      );

      expect(plantAssetIds).to.be.an('array').that.is.empty;
    });
  });

  it('Get plant assets with no matching beds', () => {
    const locationName = 'SomeField';
    const checkedBeds = ['NonExistentBed1', 'NonExistentBed2'];

    cy.wrap(farmosUtil.getPlantAssets(locationName, checkedBeds)).then(
      (plantAssetIds) => {
        console.log(
          `Location: ${locationName}, Beds: ${checkedBeds}, Plant Asset IDs: ${plantAssetIds}`
        );

        expect(plantAssetIds).to.be.an('array').that.is.empty;
      }
    );
  });
});
