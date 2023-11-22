import * as farmosUtil from './farmosUtil.js';

describe('Test the user utility functions', () => {
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

  it('Get the users', () => {
    cy.wrap(farmosUtil.getUsers(farm)).then((users) => {
      expect(users).to.not.be.null;

      expect(users[0].attributes.name).to.equal('admin');
      expect(users[0].type).to.equal('user--user');

      expect(users[1].attributes.name).to.equal('guest');
      expect(users[1].type).to.equal('user--user');

      expect(users[2].attributes.name).to.equal('manager1');
      expect(users[2].type).to.equal('user--user');

      expect(users[4].attributes.name).to.equal('worker1');
      expect(users[4].type).to.equal('user--user');

      expect(users.length).to.equal(9);
    });
  });

  it('Test that getUsers throws error if fetch fails', () => {
    cy.intercept('GET', '**/api/user/user?*', {
      forceNetworkError: true,
    });

    farmosUtil.clearCachedUsers();

    farmosUtil
      .getUsers(farm)
      .then(() => {
        throw new Error('Fetching users should have failed.');
      })
      .catch((error) => {
        expect(error.message).to.equal('Unable to fetch users.');
      });
  });

  it('Test that getUsers is cached', () => {
    farmosUtil.clearCachedUsers();
    expect(farmosUtil.getGlobalUsers()).to.be.null;
    expect(sessionStorage.getItem('users')).to.be.null;

    farmosUtil.getUsers(farm).then(() => {
      expect(farmosUtil.getGlobalUsers()).to.not.be.null;
      expect(sessionStorage.getItem('users')).to.not.be.null;
    });
  });

  it('Get the usernameMap', () => {
    cy.wrap(farmosUtil.getUsernameToUserMap(farm)).then((usernameMap) => {
      expect(usernameMap).to.not.be.null;

      expect(usernameMap.get('Anonymous')).to.be.undefined;

      expect(usernameMap.get('admin')).to.not.be.null;
      expect(usernameMap.get('admin').id).to.not.be.null;
      expect(usernameMap.get('admin').type).to.equal('user--user');

      expect(usernameMap.get('guest')).to.not.be.null;
      expect(usernameMap.get('guest').id).to.not.be.null;
      expect(usernameMap.get('guest').type).to.equal('user--user');

      expect(usernameMap.size).to.equal(9);
    });
  });

  it('Get the userIdMap', () => {
    cy.wrap(farmosUtil.getUserIdToUserMap(farm)).then((userIdMap) => {
      expect(userIdMap).to.not.be.null;

      cy.wrap(farmosUtil.getUsernameToUserMap(farm)).then((usernameMap) => {
        expect(usernameMap.get('Anonymous')).to.be.undefined;

        const adminId = usernameMap.get('admin').id;
        expect(userIdMap.get(adminId).attributes.display_name).to.equal(
          'admin'
        );
        expect(userIdMap.get(adminId).type).to.equal('user--user');

        const managerId = usernameMap.get('manager1').id;
        expect(userIdMap.get(managerId).attributes.display_name).to.equal(
          'manager1'
        );
        expect(userIdMap.get(managerId).type).to.equal('user--user');

        const guestId = usernameMap.get('guest').id;
        expect(userIdMap.get(guestId).attributes.display_name).to.equal(
          'guest'
        );
        expect(userIdMap.get(guestId).type).to.equal('user--user');

        expect(userIdMap.size).to.equal(9);
      });
    });
  });
});
