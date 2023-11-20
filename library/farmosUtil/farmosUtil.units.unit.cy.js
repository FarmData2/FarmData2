import * as farmosUtil from './farmosUtil.js';

describe('Test the units utility functions', () => {
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

  it('Get the units', () => {
    cy.wrap(farmosUtil.getUnits(farm)).then((units) => {
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
    cy.intercept('GET', '**/api/taxonomy_term/unit?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getUnits(farm)
        .then(() => {
          throw new Error('Fetching units should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch units.');
        })
    );
  });

  it('Get the unitToTerm map', () => {
    cy.wrap(farmosUtil.getUnitToTermMap(farm)).then((unitMap) => {
      expect(unitMap).to.not.be.null;
      expect(unitMap.size).to.equal(5);

      expect(unitMap.get('Count')).to.not.be.null;
      expect(unitMap.get('Count').type).to.equal('taxonomy_term--unit');

      expect(unitMap.get('CELLS/TRAY')).to.not.be.null;
      expect(unitMap.get('CELLS/TRAY').type).to.equal('taxonomy_term--unit');
    });
  });

  it('Get the UnitIdToAsset map', () => {
    cy.wrap(farmosUtil.getUnitIdToTermMap(farm)).then((unitIdMap) => {
      expect(unitIdMap).to.not.be.null;
      expect(unitIdMap.size).to.equal(5);

      cy.wrap(farmosUtil.getUnitToTermMap(farm)).then((unitNameMap) => {
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
