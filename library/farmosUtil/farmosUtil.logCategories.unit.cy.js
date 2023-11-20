import * as farmosUtil from './farmosUtil.js';

describe('Test the log categories utility functions', () => {
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

  it('Get the log categories', () => {
    cy.wrap(farmosUtil.getLogCategories(farm)).then((categories) => {
      expect(categories).to.not.be.null;
      expect(categories.length).to.equal(3);

      expect(categories[0].attributes.name).to.equal('seeding_cover_crop');
      expect(categories[0].attributes.description.value).to.equal(
        'For seeding logs representing seedings of cover crops.'
      );
      expect(categories[0].type).to.equal('taxonomy_term--log_category');

      expect(categories[2].attributes.name).to.equal('seeding_tray');
      expect(categories[2].attributes.description.value).to.equal(
        'For seeding logs representing seedings in trays.'
      );
      expect(categories[2].type).to.equal('taxonomy_term--log_category');
    });
  });

  it('Test that get units throws error if fetch fails', () => {
    cy.intercept('GET', '**/api/taxonomy_term/log_category?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getLogCategories(farm)
        .then(() => {
          throw new Error('Fetching log categories should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch log categories.');
        })
    );
  });

  it('Get the logCategoryToTerm map', () => {
    cy.wrap(farmosUtil.getLogCategoryToTermMap(farm)).then((categoryMap) => {
      expect(categoryMap).to.not.be.null;
      expect(categoryMap.size).to.equal(3);

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
    cy.wrap(farmosUtil.getLogCategoryIdToTermMap(farm)).then(
      (categoryIdMap) => {
        expect(categoryIdMap).to.not.be.null;
        expect(categoryIdMap.size).to.equal(3);

        cy.wrap(farmosUtil.getLogCategoryToTermMap(farm)).then(
          (categoryNameMap) => {
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
          }
        );
      }
    );
  });
});
