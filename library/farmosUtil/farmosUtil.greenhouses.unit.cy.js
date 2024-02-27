import * as farmosUtil from './farmosUtil.js';

describe('Test the greenhouse utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the greenhouse structure assets', () => {
    cy.wrap(farmosUtil.getGreenhouses()).then((gh) => {
      expect(gh).to.not.be.null;
      expect(gh.length).to.equal(3);

      expect(gh[0].attributes.name).to.equal('CHUAU');
      expect(gh[0].type).to.equal('asset--structure');

      expect(gh[1].attributes.name).to.equal('GHANA');
      expect(gh[1].type).to.equal('asset--structure');

      expect(gh[2].attributes.name).to.equal('JASMINE');
      expect(gh[2].type).to.equal('asset--structure');
    });
  });

  it(
    'Test that getGreenhouses throws error if fetch fails',
    { retries: 4 },
    () => {
      farmosUtil.clearCachedGreenhouses();

      cy.intercept('GET', '**/api/asset/structure?*', {
        forceNetworkError: true,
      });

      cy.wrap(
        farmosUtil
          .getGreenhouses()
          .then(() => {
            throw new Error('Fetching greenhouses should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal('Unable to fetch greenhouses.');
          })
      );
    }
  );

  it('Check that greenhouses are cached', () => {
    cy.wrap(farmosUtil.getGreenhouses()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('greenhouses')).to.not.be
        .null;
      expect(sessionStorage.getItem('greenhouses')).to.not.be.null;
    });
  });

  it('Get the GreenhouseNameToAsset map', () => {
    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((ghNameMap) => {
      expect(ghNameMap).to.not.be.null;
      expect(ghNameMap.size).to.equal(3);

      expect(ghNameMap.get('CHUAU')).to.not.be.null;
      expect(ghNameMap.get('CHUAU').type).to.equal('asset--structure');

      expect(ghNameMap.get('GHANA')).to.not.be.null;
      expect(ghNameMap.get('GHANA').type).to.equal('asset--structure');

      expect(ghNameMap.get('JASMINE')).to.not.be.null;
      expect(ghNameMap.get('JASMINE').type).to.equal('asset--structure');

      expect(ghNameMap.get('A')).to.be.undefined;
    });
  });

  it('Get the GreenhouseIdToAsset map', () => {
    cy.wrap(farmosUtil.getGreenhouseIdToAssetMap()).then((ghIdMap) => {
      expect(ghIdMap).to.not.be.null;
      expect(ghIdMap.size).to.equal(3);

      cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((ghNameMap) => {
        const chuauId = ghNameMap.get('CHUAU').id;
        expect(ghIdMap.get(chuauId).attributes.name).to.equal('CHUAU');
        expect(ghIdMap.get(chuauId).type).to.equal('asset--structure');

        const ghanaId = ghNameMap.get('GHANA').id;
        expect(ghIdMap.get(ghanaId).attributes.name).to.equal('GHANA');
        expect(ghIdMap.get(ghanaId).type).to.equal('asset--structure');

        const jasmineId = ghNameMap.get('JASMINE').id;
        expect(ghIdMap.get(jasmineId).attributes.name).to.equal('JASMINE');
        expect(ghIdMap.get(jasmineId).type).to.equal('asset--structure');
      });
    });
  });
});
