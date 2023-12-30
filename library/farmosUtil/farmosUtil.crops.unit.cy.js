import * as farmosUtil from './farmosUtil.js';

describe('Test the crop utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the crops', () => {
    cy.wrap(farmosUtil.getCrops()).then((crops) => {
      expect(crops).to.not.be.null;
      expect(crops.length).to.equal(28);

      expect(crops[0].attributes.name).to.equal('ARUGULA');
      expect(crops[0].type).to.equal('taxonomy_term--plant_type');

      expect(crops[27].attributes.name).to.equal('ZUCCHINI');
      expect(crops[27].type).to.equal('taxonomy_term--plant_type');
    });
  });

  it('Test that getCrop throws error if fetch fails', { retries: 4 }, () => {
    farmosUtil.clearCachedCrops();

    cy.intercept('GET', '**/api/taxonomy_term/plant_type?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getCrops()
        .then(() => {
          throw new Error('Fetching crops should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch crops.');
        })
    );
  });

  it('Check that crops are cached', () => {
    cy.wrap(farmosUtil.getCrops()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('crops')).to.not.be.null;
      expect(sessionStorage.getItem('crops')).to.not.be.null;
    });
  });

  it('Get the cropNameMap', () => {
    cy.wrap(farmosUtil.getCropNameToTermMap()).then((cropNameMap) => {
      expect(cropNameMap).to.not.be.null;
      expect(cropNameMap.size).to.equal(28);

      // Note: Not checking specific id's because they can change
      // if the sample database changes.  The next test will check
      // that id's and names map back and forth.

      expect(cropNameMap.get('ARUGULA')).to.not.be.null;
      expect(cropNameMap.get('ARUGULA').id).to.not.be.null;
      expect(cropNameMap.get('ARUGULA').type).to.equal(
        'taxonomy_term--plant_type'
      );

      expect(cropNameMap.get('ZUCCHINI')).to.not.be.null;
      expect(cropNameMap.get('ZUCCHINI').id).to.not.be.null;
      expect(cropNameMap.get('ZUCCHINI').type).to.equal(
        'taxonomy_term--plant_type'
      );
    });
  });

  it('Get the cropIdMap', () => {
    cy.wrap(farmosUtil.getCropIdToTermMap()).then((cropIdMap) => {
      expect(cropIdMap).to.not.be.null;
      expect(cropIdMap.size).to.equal(28);

      cy.wrap(farmosUtil.getCropNameToTermMap()).then((cropNameMap) => {
        const arugulaId = cropNameMap.get('ARUGULA').id;
        expect(cropIdMap.get(arugulaId).attributes.name).to.equal('ARUGULA');
        expect(cropIdMap.get(arugulaId).type).to.equal(
          'taxonomy_term--plant_type'
        );

        const zucchiniId = cropNameMap.get('ZUCCHINI').id;
        expect(cropIdMap.get(zucchiniId).attributes.name).to.equal('ZUCCHINI');
        expect(cropIdMap.get(zucchiniId).type).to.equal(
          'taxonomy_term--plant_type'
        );
      });
    });
  });
});
