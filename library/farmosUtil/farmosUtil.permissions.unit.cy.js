import * as farmosUtil from './farmosUtil.js';

describe('Test the permissions checking utility functions', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Get the permissions as admin', () => {
    cy.wrap(farmosUtil.getPermissions()).then((perms) => {
      expect(perms).to.not.be.null;

      // This will need to be updated for each change to the permissions list.
      // That is on purpose so that the rest of the test gets updated too!
      expect(Object.keys(perms).length).to.equal(5);

      // Add checks for each additional permission here.
      // Maintain in same order as the object returned from the API call.
      expect(perms['create-equipment-asset']).to.be.true;
      expect(perms['create-land-asset']).to.be.true;
      expect(perms['create-plant-asset']).to.be.true;
      expect(perms['create-structure-asset']).to.be.true;
      expect(perms['create-terms-in-tray_size']).to.be.true;
    });
  });

  it('Get the permissions as guest', () => {
    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.wrap(farmosUtil.getPermissions()).then((perms) => {
        /*
         * Don't check every permission here.
         */
        expect(perms).to.not.be.null;
        expect(perms['create-plant-asset']).to.be.false;
        expect(perms['create-land-asset']).to.be.false;
        expect(perms['create-structure-asset']).to.be.false;
        expect(perms['create-terms-in-tray_size']).to.be.false;
      });
    });
  });

  it('Check that permissions are cached', () => {
    farmosUtil.clearCachedFarm();
    farmosUtil.clearCachedPermissions();
    // calling getPermissions here will use admin credentials
    cy.wrap(farmosUtil.getPermissions()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('permissions')).to.not.be
        .null;
      expect(sessionStorage.getItem('permissions')).to.not.be.null;
    });
  });

  it(
    'Test that getPermissions throws error if fetch fails',
    { retries: 4 },
    () => {
      farmosUtil.clearCachedPermissions();

      cy.intercept('GET', '**/api/permissions', {
        statusCode: 403,
        body: 'Can not fetch permissions.',
      });

      cy.wrap(
        farmosUtil
          .getPermissions()
          .then(() => {
            throw new Error('Fetching permissions should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.equal('Unable to fetch permissions.');
          })
      );
    }
  );

  it('Test getPermission function as admin', () => {
    farmosUtil.clearCachedFarm();
    // calling checkPermission here will use admin credentials
    cy.wrap(farmosUtil.checkPermission('create-plant-asset')).should('be.true');
    cy.wrap(farmosUtil.checkPermission('create-structure-asset')).should(
      'be.true'
    );
  });

  it('Test getPermission function as guest', () => {
    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.wrap(farmosUtil.getPermissions()).then(() => {
        cy.wrap(farmosUtil.checkPermission('create-plant-asset')).should(
          'be.false'
        );
        cy.wrap(farmosUtil.checkPermission('create-structure-asset')).should(
          'be.false'
        );
      });
    });
  });

  it('Test getPermission with a non-existent permission', () => {
    cy.wrap(
      farmosUtil
        .checkPermission('blah blah')
        .then(() => {
          throw new Error('Fetching undefined permission should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal(
            'Permission blah blah does not exist.'
          );
        })
    );
  });
});
