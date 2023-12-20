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

  it(
    'Test that getLogCategories uses global variable cache',
    { retries: 4 },
    () => {
      cy.intercept(
        'GET',
        '**/api/taxonomy_term/log_category?',
        cy.spy().as('fetchLogCategories')
      );

      farmosUtil.clearCachedLogCategories();
      expect(farmosUtil.getGlobalLogCategories()).to.be.null;
      expect(sessionStorage.getItem('log_categories')).to.be.null;

      // Get the first one to ensure the cache is populated.
      cy.wrap(farmosUtil.getLogCategories())
        .then(() => {
          cy.get('@fetchLogCategories').its('callCount').should('equal', 1);
          expect(farmosUtil.getGlobalLogCategories()).not.to.be.null;
          expect(sessionStorage.getItem('log_categories')).not.to.be.null;
        })
        .then(() => {
          // Now check that the global is used.
          sessionStorage.removeItem('log_categories');
          cy.wrap(farmosUtil.getLogCategories()).then(() => {
            cy.get('@fetchLogCategories').its('callCount').should('equal', 1);
            expect(farmosUtil.getGlobalLogCategories()).not.to.be.null;
            expect(sessionStorage.getItem('log_categories')).to.be.null;
          });
        });
    }
  );

  it(
    'Test that getLogCategories uses session storage cache',
    { retries: 4 },
    () => {
      cy.intercept(
        'GET',
        '**/api/taxonomy_term/log_category?',
        cy.spy().as('fetchLogCategories')
      );

      farmosUtil.clearCachedLogCategories();
      expect(farmosUtil.getGlobalLogCategories()).to.be.null;
      expect(sessionStorage.getItem('log_categories')).to.be.null;

      // Get the first one to ensure the cache is populated.
      cy.wrap(farmosUtil.getLogCategories())
        .then(() => {
          cy.get('@fetchLogCategories').should('have.been.calledOnce');
          expect(farmosUtil.getGlobalLogCategories()).not.to.be.null;
          expect(sessionStorage.getItem('log_categories')).not.to.be.null;
        })
        .then(() => {
          farmosUtil.clearGlobalLogCategories();
          expect(farmosUtil.getGlobalLogCategories()).to.be.null;
          expect(sessionStorage.getItem('log_categories')).not.to.be.null;

          // Now check that the session storage is used.
          cy.wrap(farmosUtil.getLogCategories()).then(() => {
            cy.get('@fetchLogCategories').should('have.been.calledOnce');
            expect(farmosUtil.getGlobalLogCategories()).to.not.be.null;
            expect(sessionStorage.getItem('log_categories')).to.not.be.null;
          });
        });

      cy.get('@fetchLogCategories').should('have.been.calledOnce');
    }
  );

  it('Get the logCategoryToTerm map', () => {
    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((categoryMap) => {
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
    cy.wrap(farmosUtil.getLogCategoryIdToTermMap()).then((categoryIdMap) => {
      expect(categoryIdMap).to.not.be.null;
      expect(categoryIdMap.size).to.equal(3);

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