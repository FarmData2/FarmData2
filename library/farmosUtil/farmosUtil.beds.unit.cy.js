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

  it('Get the bed land assets', () => {
    cy.wrap(farmosUtil.getBeds()).then((beds) => {
      expect(beds).to.not.be.null;
      expect(beds.length).to.equal(15);

      expect(beds[0].attributes.name).to.equal('ALF-1');
      expect(beds[0].type).to.equal('asset--land');

      expect(beds[14].attributes.name).to.equal('H-2');
      expect(beds[14].type).to.equal('asset--land');
    });
  });

  it('Check that beds are cached', () => {
    cy.wrap(farmosUtil.getBeds()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('beds')).to.not.be.null;
      expect(sessionStorage.getItem('beds')).to.not.be.null;
    });
  });

  it('Get beds throws error if fetch fails', { retries: 4 }, () => {
    farmosUtil.clearCachedBeds();

    cy.intercept('GET', '**/api/asset/land?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getBeds()
        .then(() => {
          throw new Error('Fetching beds should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch beds.');
        })
    );
  });

  it('Get the BedNameToAsset map', () => {
    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((bedNameMap) => {
      expect(bedNameMap).to.not.be.null;
      expect(bedNameMap.size).to.equal(15);

      expect(bedNameMap.get('ALF-1')).to.not.be.null;
      expect(bedNameMap.get('ALF-1').type).to.equal('asset--land');

      expect(bedNameMap.get('GHANA-4')).to.not.be.null;
      expect(bedNameMap.get('GHANA-4').type).to.equal('asset--land');

      expect(bedNameMap.get('ALF')).to.be.undefined;
      expect(bedNameMap.get('CHUAU')).to.be.undefined;
    });
  });

  it('Get the BedIdToAsset map', () => {
    cy.wrap(farmosUtil.getBedIdToAssetMap()).then((bedIdMap) => {
      expect(bedIdMap).to.not.be.null;
      expect(bedIdMap.size).to.equal(15);

      cy.wrap(farmosUtil.getBedNameToAssetMap()).then((bedNameMap) => {
        const bedALF1Id = bedNameMap.get('ALF-1').id;
        expect(bedIdMap.get(bedALF1Id).attributes.name).to.equal('ALF-1');
        expect(bedIdMap.get(bedALF1Id).type).to.equal('asset--land');

        const bedGHANA4Id = bedNameMap.get('GHANA-4').id;
        expect(bedIdMap.get(bedGHANA4Id).attributes.name).to.equal('GHANA-4');
        expect(bedIdMap.get(bedGHANA4Id).type).to.equal('asset--land');
      });
    });
  });

  it('Check empty beds in sample database', () => {
    // These beds should be empty in the sample database because other tests rely on them

    cy.wrap(farmosUtil.getPlantAssets('ALF', ['ALF-3', 'ALF-4'])).then(
      (plantAssets) => {
        expect(plantAssets).to.have.length(0);
      }
    );

    cy.wrap(farmosUtil.getPlantAssets('H', ['H-1', 'H-2'])).then(
      (plantAssets) => {
        expect(plantAssets).to.have.length(0);
      }
    );
  });
});
