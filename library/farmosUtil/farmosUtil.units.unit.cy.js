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
      expect(units.length).to.equal(5);

      expect(units[0].attributes.name).to.equal('CELLS/TRAY');
      expect(units[0].attributes.description.value).to.equal(
        'The number of cells in a tray.'
      );
      expect(units[0].type).to.equal('taxonomy_term--unit');

      expect(units[4].attributes.name).to.equal('TRAYS');
      expect(units[4].attributes.description.value).to.equal(
        'A number of seeding trays.'
      );
      expect(units[4].type).to.equal('taxonomy_term--unit');
    });
  });

  it('Test that get units throws error if fetch fails', () => {
    farmosUtil.clearCachedUnits();

    cy.intercept('GET', '**/api/taxonomy_term/unit?*', {
      forceNetworkError: true,
    });

    farmosUtil
      .getUnits()
      .then(() => {
        throw new Error('Fetching units should have failed.');
      })
      .catch((error) => {
        expect(error.message).to.equal('Unable to fetch units.');
      });
  });

  it('Test that getUnits result is cached', () => {
    farmosUtil.clearCachedUnits();
    expect(farmosUtil.getGlobalUnits()).to.be.null;
    expect(sessionStorage.getItem('units')).to.be.null;

    farmosUtil.getUnits().then(() => {
      expect(farmosUtil.getGlobalUnits()).to.not.be.null;
      expect(sessionStorage.getItem('units')).to.not.be.null;
    });
  });

  it('Get the unitToTerm map', () => {
    cy.wrap(farmosUtil.getUnitToTermMap()).then((unitMap) => {
      expect(unitMap).to.not.be.null;
      expect(unitMap.size).to.equal(5);

      expect(unitMap.get('Count')).to.not.be.null;
      expect(unitMap.get('Count').type).to.equal('taxonomy_term--unit');

      expect(unitMap.get('CELLS/TRAY')).to.not.be.null;
      expect(unitMap.get('CELLS/TRAY').type).to.equal('taxonomy_term--unit');
    });
  });

  it('Get the UnitIdToAsset map', () => {
    cy.wrap(farmosUtil.getUnitIdToTermMap()).then((unitIdMap) => {
      expect(unitIdMap).to.not.be.null;
      expect(unitIdMap.size).to.equal(5);

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
