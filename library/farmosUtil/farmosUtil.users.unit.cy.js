import * as farmosUtil from './farmosUtil.js';

describe('Test the user utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Get the users', () => {
    cy.wrap(farmosUtil.getUsers()).then((users) => {
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

  it('Check that users are cached', () => {
    cy.wrap(farmosUtil.getUsers()).then(() => {
      expect(farmosUtil.getFromGlobalVariableCache('users')).to.not.be.null;
      expect(sessionStorage.getItem('users')).to.not.be.null;
    });
  });

  it('getUsers throws error if fetch fails', { retries: 4 }, () => {
    farmosUtil.clearCachedUsers();

    cy.intercept('GET', '**/api/user/user?*', {
      forceNetworkError: true,
    });

    cy.wrap(
      farmosUtil
        .getUsers()
        .then(() => {
          throw new Error('Fetching users should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Unable to fetch users.');
        })
    );
  });

  it('Get the usernameMap', () => {
    cy.wrap(farmosUtil.getUsernameToUserMap()).then((usernameMap) => {
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
    cy.wrap(farmosUtil.getUserIdToUserMap()).then((userIdMap) => {
      expect(userIdMap).to.not.be.null;

      cy.wrap(farmosUtil.getUsernameToUserMap()).then((usernameMap) => {
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
