import * as farmosUtil from './farmosUtil.js';

describe('Test the log categories utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the log categories', () => {
    cy.wrap(farmosUtil.getLogCategories()).then((categories) => {
      expect(categories).to.not.be.null;
      expect(categories.length).to.equal(12);

      expect(categories[0].attributes.name).to.equal('amendment');
      expect(categories[0].attributes.description.value).to.equal(
        'For logs where soil amendments are made.'
      );
      expect(categories[0].type).to.equal('taxonomy_term--log_category');

      expect(categories[2].attributes.name).to.equal('irrigation');
      expect(categories[2].attributes.description.value).to.equal(
        'For logs associated with field irrigation.'
      );
      expect(categories[2].type).to.equal('taxonomy_term--log_category');
    });
  });

  it('Check that log categories are cached', () => {
    cy.wrap(farmosUtil.getLogCategories()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('log_categories')).to.not.be
        .null;
      expect(sessionStorage.getItem('log_categories')).to.not.be.null;
    });
  });

  it('Test that get units throws error if fetch fails', { retries: 4 }, () => {
    farmosUtil.clearCachedLogCategories();

    cy.intercept('GET', '**/api/taxonomy_term/log_category?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getLogCategories()
        .then(() => {
          throw new Error('Fetching log categories should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch log categories.');
        })
    );
  });

  it('Get the logCategoryToTerm map', () => {
    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((categoryMap) => {
      expect(categoryMap).to.not.be.null;
      expect(categoryMap.size).to.equal(12);

      expect(categoryMap.get('seeding_cover_crop')).to.not.be.null;
      expect(categoryMap.get('seeding_cover_crop').type).to.equal(
        'taxonomy_term--log_category'
      );

      expect(categoryMap.get('seeding_tray')).to.not.be.null;
      expect(categoryMap.get('seeding_tray').type).to.equal(
        'taxonomy_term--log_category'
      );
    });
  });

  it('Get the logCategoryIdToAsset map', () => {
    cy.wrap(farmosUtil.getLogCategoryIdToTermMap()).then((categoryIdMap) => {
      expect(categoryIdMap).to.not.be.null;
      expect(categoryIdMap.size).to.equal(12);

      cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((categoryNameMap) => {
        const coverId = categoryNameMap.get('seeding_cover_crop').id;
        expect(categoryIdMap.get(coverId).attributes.name).to.equal(
          'seeding_cover_crop'
        );
        expect(categoryIdMap.get(coverId).type).to.equal(
          'taxonomy_term--log_category'
        );

        const trayId = categoryNameMap.get('seeding_tray').id;
        expect(categoryIdMap.get(trayId).attributes.name).to.equal(
          'seeding_tray'
        );
        expect(categoryIdMap.get(trayId).type).to.equal(
          'taxonomy_term--log_category'
        );
      });
    });
  });
});
