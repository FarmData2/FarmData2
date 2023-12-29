import * as farmosUtil from './farmosUtil.js';

describe('Test the caching behavior', () => {
  /*
   * Don't save and restore the session and local storage in these
   * tests.  That way we have more explicit control over the caching.
   */

  it('fetchWithCaching uses global variable cache', () => {
    farmosUtil.clearCachedValue('cacheTest');
    expect(farmosUtil.getFromGlobalVariableCache('cacheTest')).to.be.null;
    expect(sessionStorage.getItem('cacheTest')).to.be.null;

    const mockFetch = {
      fetchedValue: async () => {
        return { one: 'two' };
      },
    };
    const fetchFunc = cy.spy(mockFetch, 'fetchedValue');

    // Get the first one to ensure the cache is populated.
    cy.wrap(
      farmosUtil.fetchWithCaching('cacheTest', mockFetch.fetchedValue)
    ).as('value');

    cy.get('@value')
      .then((value) => {
        expect(fetchFunc).to.be.calledOnce;
        expect(value.one).to.equal('two');

        const globalVal = farmosUtil.getFromGlobalVariableCache('cacheTest');
        expect(globalVal.one).to.equal('two');

        const sessionVal = JSON.parse(sessionStorage.getItem('cacheTest'));
        expect(sessionVal.one).to.equal('two');
      })
      .then(() => {
        // Now clear the session storage to ensure that the value came from the global.
        sessionStorage.removeItem('cacheTest');

        cy.wrap(
          farmosUtil.fetchWithCaching('cacheTest', mockFetch.fetchedValue)
        ).as('value2');

        cy.get('@value2').then((value2) => {
          // Should still have only been one API call.
          expect(fetchFunc).to.be.calledOnce;
          expect(value2.one).to.equal('two');

          const globalVal2 = farmosUtil.getFromGlobalVariableCache('cacheTest');
          expect(globalVal2.one).to.equal('two');

          // Note: sessionStorage is not recreated when we get the value from the global.
          const sessionVal2 = sessionStorage.getItem('cacheTest');
          expect(sessionVal2).to.be.null;
        });
      });
  });

  it('fetchWithCaching uses sessionStorage cache', () => {
    farmosUtil.clearCachedValue('cacheTest');
    expect(farmosUtil.getFromGlobalVariableCache('cacheTest')).to.be.null;
    expect(sessionStorage.getItem('cacheTest')).to.be.null;

    const mockFetch = {
      fetchedValue: async () => {
        return { one: 'two' };
      },
    };
    const fetchFunc = cy.spy(mockFetch, 'fetchedValue');

    // Get the first one to ensure the cache is populated.
    cy.wrap(
      farmosUtil.fetchWithCaching('cacheTest', mockFetch.fetchedValue)
    ).as('value');

    cy.get('@value')
      .then((value) => {
        expect(fetchFunc).to.be.calledOnce;
        expect(value.one).to.equal('two');

        const globalVal = farmosUtil.getFromGlobalVariableCache('cacheTest');
        expect(globalVal.one).to.equal('two');

        const sessionVal = JSON.parse(sessionStorage.getItem('cacheTest'));
        expect(sessionVal.one).to.equal('two');
      })
      .then(() => {
        // Clear the global so we test if we get the value from the sessionStorage.
        farmosUtil.clearFromGlobalVariableCache('cacheTest');
        expect(farmosUtil.getFromGlobalVariableCache('cacheTest')).to.be.null;
        expect(sessionStorage.getItem('cacheTest')).not.to.be.null;

        cy.wrap(
          farmosUtil.fetchWithCaching('cacheTest', mockFetch.fetchedValue)
        ).as('value2');

        cy.get('@value2').then((value2) => {
          // Should still have been only one API call.
          expect(fetchFunc).to.be.calledOnce;
          expect(value2.one).to.equal('two');

          const globalVal2 = farmosUtil.getFromGlobalVariableCache('cacheTest');
          expect(globalVal2.one).to.equal('two');

          const sessionVal2 = JSON.parse(sessionStorage.getItem('cacheTest'));
          expect(sessionVal2.one).to.equal('two');
        });
      });
  });
});
