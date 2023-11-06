import * as farmosUtil from './farmosUtil.js';

describe('Test the land utility functions', () => {
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

  it('Get the field and bed land assets', () => {
    cy.wrap(farmosUtil.getFieldsAndBeds(farm)).then((land) => {
      expect(land).to.not.be.null;
      expect(land.length).to.equal(65);

      expect(land[0].attributes.name).to.equal('A');
      expect(land[0].type).to.equal('asset--land');

      expect(land[64].attributes.name).to.equal('Z');
      expect(land[64].type).to.equal('asset--land');
    });
  });

  it('Test that get fields and beds throws error if fetch fails', () => {
    cy.intercept('GET', '**/api/asset/land?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getFieldsAndBeds(farm)
        .then(() => {
          throw new Error('Fetching fields and beds should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch fields and beds.');
        })
    );
  });

  it('Get the FieldOrBedNameToAsset map', () => {
    cy.wrap(farmosUtil.getFieldOrBedNameToAssetMap(farm)).then(
      (landNameMap) => {
        expect(landNameMap).to.not.be.null;
        expect(landNameMap.size).to.equal(65);

        expect(landNameMap.get('A')).to.not.be.null;
        expect(landNameMap.get('A').type).to.equal('asset--land');

        expect(landNameMap.get('Z')).to.not.be.null;
        expect(landNameMap.get('Z').type).to.equal('asset--land');

        expect(landNameMap.get('CHUAU-1')).to.not.be.null;
        expect(landNameMap.get('CHUAU-1').type).to.equal('asset--land');

        expect(landNameMap.get('CHUAU')).to.be.undefined;
      }
    );
  });

  it('Get the FieldOrBedIdToAsset map', () => {
    cy.wrap(farmosUtil.getFieldOrBedIdToAssetMap(farm)).then((landIdMap) => {
      expect(landIdMap).to.not.be.null;
      expect(landIdMap.size).to.equal(65);

      cy.wrap(farmosUtil.getFieldOrBedNameToAssetMap(farm)).then(
        (landNameMap) => {
          const landAId = landNameMap.get('A').id;
          expect(landIdMap.get(landAId).attributes.name).to.equal('A');
          expect(landIdMap.get(landAId).type).to.equal('asset--land');

          const landChuau1Id = landNameMap.get('CHUAU-1').id;
          expect(landIdMap.get(landChuau1Id).attributes.name).to.equal(
            'CHUAU-1'
          );
          expect(landIdMap.get(landChuau1Id).type).to.equal('asset--land');
        }
      );
    });
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
