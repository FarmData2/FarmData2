import * as farmosUtil from './farmosUtil.js';

describe('Test the tray sizes utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the tray sizes', () => {
    cy.wrap(farmosUtil.getTraySizes()).then((traySizes) => {
      expect(traySizes).to.not.be.null;
      expect(traySizes.length).to.equal(6);

      expect(traySizes[0].attributes.name).to.equal('50');
      expect(traySizes[0].attributes.description.value).to.equal(
        '50 cell tray'
      );
      expect(traySizes[0].type).to.equal('taxonomy_term--tray_size');

      expect(traySizes[5].attributes.name).to.equal('288');
      expect(traySizes[5].attributes.description.value).to.equal(
        '288 cell tray'
      );
      expect(traySizes[5].type).to.equal('taxonomy_term--tray_size');
    });
  });

  it('Check that tray sizes are cached', () => {
    cy.wrap(farmosUtil.getTraySizes()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('tray_sizes')).to.not.be
        .null;
      expect(sessionStorage.getItem('tray_sizes')).to.not.be.null;
    });
  });

  it(
    'Test that get tray sizes throws error if fetch fails',
    { retries: 4 },
    () => {
      farmosUtil.clearCachedTraySizes();

      cy.intercept('GET', '**/api/taxonomy_term/tray_size?*', {
        forceNetworkError: true,
      });

      cy.wrap(
        farmosUtil
          .getTraySizes()
          .then(() => {
            throw new Error('Fetching tray sizes should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal('Unable to fetch tray sizes.');
          })
      );
    }
  );

  it('Get the TraySizeToTerm map', () => {
    cy.wrap(farmosUtil.getTraySizeToTermMap()).then((traySizeMap) => {
      expect(traySizeMap).to.not.be.null;
      expect(traySizeMap.size).to.equal(6);

      expect(traySizeMap.get('50')).to.not.be.null;
      expect(traySizeMap.get('50').type).to.equal('taxonomy_term--tray_size');

      expect(traySizeMap.get('288')).to.not.be.null;
      expect(traySizeMap.get('288').type).to.equal('taxonomy_term--tray_size');
    });
  });

  it('Get the TraySizeIdToAsset map', () => {
    cy.wrap(farmosUtil.getTraySizeIdToTermMap()).then((trayIdMap) => {
      expect(trayIdMap).to.not.be.null;
      expect(trayIdMap.size).to.equal(6);

      cy.wrap(farmosUtil.getTraySizeToTermMap()).then((trayNameMap) => {
        const tray50Id = trayNameMap.get('50').id;
        expect(trayIdMap.get(tray50Id).attributes.name).to.equal('50');
        expect(trayIdMap.get(tray50Id).type).to.equal(
          'taxonomy_term--tray_size'
        );

        const tray288Id = trayNameMap.get('288').id;
        expect(trayIdMap.get(tray288Id).attributes.name).to.equal('288');
        expect(trayIdMap.get(tray288Id).type).to.equal(
          'taxonomy_term--tray_size'
        );
      });
    });
  });
});
