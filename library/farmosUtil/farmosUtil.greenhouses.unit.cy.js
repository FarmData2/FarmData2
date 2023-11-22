import * as farmosUtil from './farmosUtil.js';

describe('Test the greenhouse utility functions', () => {
  var farm = null;
  before(() => {
    cy.wrap(
      farmosUtil
        .getFarmOSInstance('http://farmos', 'farm', 'admin', 'admin')
        .then((newFarm) => {
          farm = newFarm;
        })
    );
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the greenhouse structure assets', () => {
    cy.wrap(farmosUtil.getGreenhouses(farm)).then((gh) => {
      expect(gh).to.not.be.null;
      expect(gh.length).to.equal(5);

      expect(gh[0].attributes.name).to.equal('CHUAU');
      expect(gh[0].type).to.equal('asset--structure');

      expect(gh[4].attributes.name).to.equal('SEEDING BENCH');
      expect(gh[4].type).to.equal('asset--structure');
    });
  });

  it('Test that getGreenhouses throws error if fetch fails', () => {
    farmosUtil.clearCachedGreenhouses();

    cy.intercept('GET', '**/api/asset/structure?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getGreenhouses(farm)
        .then(() => {
          throw new Error('Fetching greenhouses should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch greenhouses.');
        })
    );
  });

  it('Test that getGreenhouses result is cached', () => {
    farmosUtil.clearCachedGreenhouses();
    expect(farmosUtil.getGlobalGreenhouses()).to.be.null;
    expect(sessionStorage.getItem('greenhouses')).to.be.null;

    farmosUtil.getGreenhouses(farm).then(() => {
      expect(farmosUtil.getGlobalGreenhouses()).to.not.be.null;
      expect(sessionStorage.getItem('greenhouses')).to.not.be.null;
    });
  });

  it('Get the GreenhouseNameToAsset map', () => {
    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap(farm)).then((ghNameMap) => {
      expect(ghNameMap).to.not.be.null;
      expect(ghNameMap.size).to.equal(5);

      expect(ghNameMap.get('CHUAU')).to.not.be.null;
      expect(ghNameMap.get('CHUAU').type).to.equal('asset--structure');

      expect(ghNameMap.get('SEEDING BENCH')).to.not.be.null;
      expect(ghNameMap.get('SEEDING BENCH').type).to.equal('asset--structure');

      expect(ghNameMap.get('A')).to.be.undefined;
    });
  });

  it('Get the GreenhouseIdToAsset map', () => {
    cy.wrap(farmosUtil.getGreenhouseIdToAssetMap(farm)).then((ghIdMap) => {
      expect(ghIdMap).to.not.be.null;
      expect(ghIdMap.size).to.equal(5);

      cy.wrap(farmosUtil.getGreenhouseNameToAssetMap(farm)).then(
        (ghNameMap) => {
          const chuauId = ghNameMap.get('CHUAU').id;
          expect(ghIdMap.get(chuauId).attributes.name).to.equal('CHUAU');
          expect(ghIdMap.get(chuauId).type).to.equal('asset--structure');

          const sbId = ghNameMap.get('SEEDING BENCH').id;
          expect(ghIdMap.get(sbId).attributes.name).to.equal('SEEDING BENCH');
          expect(ghIdMap.get(sbId).type).to.equal('asset--structure');
        }
      );
    });
  });
});
