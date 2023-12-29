import * as farmosUtil from './farmosUtil.js';

describe('Test the units utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the units', () => {
    cy.wrap(farmosUtil.getUnits()).then((units) => {
      expect(units).to.not.be.null;
      expect(units.length).to.equal(7);

      expect(units[0].attributes.name).to.equal('CELLS');
      expect(units[0].attributes.description.value).to.equal(
        'A number of seeding tray cells.'
      );
      expect(units[0].type).to.equal('taxonomy_term--unit');

      expect(units[4].attributes.name).to.equal('SEEDS');
      expect(units[4].attributes.description.value).to.equal(
        'A number of seeds.'
      );
      expect(units[4].type).to.equal('taxonomy_term--unit');
    });
  });

  it('Test that get units throws error if fetch fails', { retries: 4 }, () => {
    farmosUtil.clearCachedUnits();

    cy.intercept('GET', '**/api/taxonomy_term/unit?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getUnits()
        .then(() => {
          throw new Error('Fetching units should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch units.');
        })
    );
  });

  it('Test that getUnits uses global variable cache', { retries: 4 }, () => {
    farmosUtil.clearCachedUnits();
    expect(farmosUtil.getGlobalUnits()).to.be.null;
    expect(sessionStorage.getItem('units')).to.be.null;

    cy.intercept(
      'GET',
      '**/api/taxonomy_term/unit?*',
      cy.spy().as('fetchUnits')
    );

    // Get the first one to ensure the cache is populated.
    cy.wrap(farmosUtil.getUnits())
      .then(() => {
        cy.get('@fetchUnits').its('callCount').should('equal', 1);
        expect(farmosUtil.getGlobalUnits()).not.to.be.null;
        expect(sessionStorage.getItem('units')).not.to.be.null;
      })
      .then(() => {
        // Now check that the global is used.
        sessionStorage.removeItem('units');
        cy.wrap(farmosUtil.getUnits()).then(() => {
          cy.get('@fetchUnits').its('callCount').should('equal', 1);
          expect(farmosUtil.getGlobalUnits()).not.to.be.null;
          expect(sessionStorage.getItem('units')).to.be.null;
        });
      });
  });

  it('Test that getUnits uses session storage cache', { retries: 4 }, () => {
    farmosUtil.clearCachedUnits();
    expect(farmosUtil.getGlobalUnits()).to.be.null;
    expect(sessionStorage.getItem('units')).to.be.null;

    cy.intercept(
      'GET',
      '**/api/taxonomy_term/unit?*',
      cy.spy().as('fetchUnits')
    );

    // Get the first one to ensure the cache is populated.
    cy.wrap(farmosUtil.getUnits())
      .then(() => {
        cy.get('@fetchUnits').its('callCount').should('equal', 1);
        expect(farmosUtil.getGlobalUnits()).not.to.be.null;
        expect(sessionStorage.getItem('units')).not.to.be.null;
      })
      .then(() => {
        farmosUtil.clearGlobalUnits();
        expect(farmosUtil.getGlobalUnits()).to.be.null;
        expect(sessionStorage.getItem('units')).not.to.be.null;

        // Now check that the session storage is used.
        cy.wrap(farmosUtil.getUnits()).then(() => {
          cy.get('@fetchUnits').its('callCount').should('equal', 1);
          expect(farmosUtil.getGlobalUnits()).to.not.be.null;
          expect(sessionStorage.getItem('units')).to.not.be.null;
        });
      });
  });

  it('Get the unitToTerm map', () => {
    cy.wrap(farmosUtil.getUnitToTermMap()).then((unitMap) => {
      expect(unitMap).to.not.be.null;
      expect(unitMap.size).to.equal(7);

      expect(unitMap.get('Count')).to.not.be.null;
      expect(unitMap.get('Count').type).to.equal('taxonomy_term--unit');

      expect(unitMap.get('CELLS/TRAY')).to.not.be.null;
      expect(unitMap.get('CELLS/TRAY').type).to.equal('taxonomy_term--unit');
    });
  });

  it('Get the UnitIdToAsset map', () => {
    cy.wrap(farmosUtil.getUnitIdToTermMap()).then((unitIdMap) => {
      expect(unitIdMap).to.not.be.null;
      expect(unitIdMap.size).to.equal(7);

      cy.wrap(farmosUtil.getUnitToTermMap()).then((unitNameMap) => {
        const countId = unitNameMap.get('Count').id;
        expect(unitIdMap.get(countId).attributes.name).to.equal('Count');
        expect(unitIdMap.get(countId).type).to.equal('taxonomy_term--unit');

        const cellsPerTrayId = unitNameMap.get('CELLS/TRAY').id;
        expect(unitIdMap.get(cellsPerTrayId).attributes.name).to.equal(
          'CELLS/TRAY'
        );
        expect(unitIdMap.get(cellsPerTrayId).type).to.equal(
          'taxonomy_term--unit'
        );
      });
    });
  });
});
