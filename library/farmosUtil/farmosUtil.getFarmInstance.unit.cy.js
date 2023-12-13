import * as farmosUtil from './farmosUtil.js';

/*
 * NOTE: The tests in this file assume that they are run
 * in order. This is a necessary assumption because they are
 * testing the caching behavior of the farmOS object, the
 * authentication token and the schema.  To do so, later tests
 * must rely on earlier tests having cached these items.
 */

describe('Test getFarmOSInstance', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  var prev_farm = null;

  // Use the farm instance to fetch data to be sure it is valid.
  function useFarm(farm) {
    cy.wrap(
      farm.user.fetch({
        filter: {
          type: 'user--user',
          status: true,
        },
        limit: Infinity,
      })
    ).then((resp) => {
      expect(resp.data).to.not.be.null;
      expect(resp.data.length).to.equal(9);
      expect(resp.data[0].type).to.equal('user--user');
      expect(resp.data[1].attributes.display_name).to.equal('manager1');
    });
  }

  it('Check getting the first instance', { retries: 4 }, () => {
    // Get the first instance
    // - check that farm_global does not exist
    // - check that token is not in local storage
    // - check that schema is not in session storage
    // Get a farm object
    // - check that farm object has token and schema
    // - check that farm object can be used to get info from server
    // - check that token was fetched
    // - check that schema was fetched
    // - check that farm_global was created
    // - check that token is saved in local storage
    // - check that schema is saved in session storage

    cy.intercept('POST', 'oauth/token').as('getToken');
    cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

    expect(farmosUtil.getFarmGlobal()).to.be.null;
    expect(localStorage.getItem('token')).to.be.null;
    expect(sessionStorage.getItem('schema')).to.be.null;

    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      expect(newFarm).to.not.be.null;
      expect(newFarm.remote.getToken()).to.not.be.null;
      expect(newFarm.schema.get()).to.not.be.null;

      useFarm(newFarm);

      cy.get('@getToken.all').should('have.length', 1);
      cy.get('@fetchSchema.all').should('have.length.at.least', 23); // base farmOS?

      expect(farmosUtil.getFarmGlobal()).to.not.be.null;
      prev_farm = newFarm;
      expect(localStorage.getItem('token')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });
  });

  it(
    'Get a second instance of farmOS with everything cached',
    { retries: 4 },
    () => {
      // Get a second instance
      // - check that farm global exists, token is cached, schema is cached.
      // Get a farm object
      // - check it has token & schema
      // - check it is the same farm object as last instance
      // - check that it can be used to get info from server
      // - check that it didn't fetch token
      // - check that it didn't fetch schema
      // - check that token is saved in local storage
      // - check that schema is saved in session storage

      cy.intercept('POST', 'oauth/token').as('getToken');
      cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

      expect(farmosUtil.getFarmGlobal()).to.not.be.null;
      expect(localStorage.getItem('token')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;

      cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
        expect(newFarm).to.not.be.null;
        expect(newFarm.remote.getToken()).to.not.be.null;
        expect(newFarm.schema.get()).to.not.be.null;

        expect(newFarm === prev_farm).to.be.true;

        useFarm(newFarm);

        cy.get('@getToken.all').should('have.length', 0);
        cy.get('@fetchSchema.all').should('have.length', 0);

        expect(localStorage.getItem('token')).to.not.be.null;
        expect(sessionStorage.getItem('schema')).to.not.be.null;
      });
    }
  );

  it('Clear the local storage.', { retries: 4 }, () => {
    // Clear localStorage
    // - check that farm global exists
    // - Check that schema is in session storage
    // - check that token is not in local storage.
    // - Get a farm object
    // - check it has token & schema
    // - check it is the same farm object as last instance
    // - check that it can be used to get info from server
    // - check that it did fetch the token
    // - check that it did not fetch the schema
    // - check that token is saved in local storage
    // - check that schema is saved in session storage

    cy.intercept('POST', 'oauth/token').as('getToken');
    cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

    localStorage.clear();
    expect(farmosUtil.getFarmGlobal()).to.not.be.null;
    expect(localStorage.getItem('token')).to.be.null;
    expect(sessionStorage.getItem('schema')).to.not.be.null;

    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      expect(newFarm).to.not.be.null;
      expect(newFarm.remote.getToken()).to.not.be.null;
      expect(newFarm.schema.get()).to.not.be.null;

      expect(newFarm === prev_farm).to.be.true;

      useFarm(newFarm);

      cy.get('@getToken.all').should('have.length', 1);
      cy.get('@fetchSchema.all').should('have.length', 0);

      expect(localStorage.getItem('token')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });
  });

  it('Clear the farm_global.', { retries: 4 }, () => {
    // Clear the farm global
    // - check that farm global does not exist
    // - Check that schema is in session storage
    // - check that token is in local storage.
    // - Get a farm object
    // - check it has token & schema
    // - check it is a different farm object than the last instance
    // - check that it can be used to get info from server
    // - check that it did not fetch the token
    // - check that it did not fetch the schema
    // - check that token is saved in local storage
    // - check that schema is saved in session storage

    cy.intercept('POST', 'oauth/token').as('getToken');
    cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

    farmosUtil.clearFarmGlobal();
    expect(farmosUtil.getFarmGlobal()).to.be.null;
    expect(localStorage.getItem('token')).to.not.be.null;
    expect(sessionStorage.getItem('schema')).to.not.be.null;

    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      expect(newFarm).to.not.be.null;
      expect(newFarm.remote.getToken()).to.not.be.null;
      expect(newFarm.schema.get()).to.not.be.null;

      expect(newFarm != prev_farm).to.be.true;
      prev_farm = newFarm;

      useFarm(newFarm);

      cy.get('@getToken.all').should('have.length', 0);
      cy.get('@fetchSchema.all').should('have.length', 0);

      expect(localStorage.getItem('token')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });
  });

  it('Clear the farm_global and session storage.', { retries: 4 }, () => {
    // Clear the farm global
    // Clear the session storage
    // - check that farm global does not exist
    // - Check that schema is not in session storage
    // - check that token is in local storage.
    // Get a farm object
    // - check it has token & schema
    // - check it is not the same farm object than the last instance
    // - check that it can be used to get info from server
    // - check that it did not fetch the token
    // - check that it did fetch the schema
    // - check that token is saved in local storage
    // - check that schema is saved in session storage

    cy.intercept('POST', 'oauth/token').as('getToken');
    cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

    farmosUtil.clearFarmGlobal();
    sessionStorage.clear();
    expect(farmosUtil.getFarmGlobal()).to.be.null;
    expect(localStorage.getItem('token')).to.not.be.null;
    expect(sessionStorage.getItem('schema')).to.be.null;

    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      expect(newFarm).to.not.be.null;
      expect(newFarm.remote.getToken()).to.not.be.null;
      expect(newFarm.schema.get()).to.not.be.null;

      expect(newFarm != prev_farm).to.be.true;
      prev_farm = newFarm;

      useFarm(newFarm);

      cy.get('@getToken.all').should('have.length', 0);
      cy.get('@fetchSchema.all').should('have.length.at.least', 23); // base farmOS

      expect(localStorage.getItem('token')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });
  });

  it('Clear everything.', { retries: 4 }, () => {
    // Clear the farm global
    // Clear the session storage
    // Clear the local storage
    // - check that farm global does not exist
    // - Check that schema is not in session storage
    // - check that token is not in local storage.
    // Get a farm object
    // - check that farm object has token and schema
    // - check that farm object can be used to get info from server
    // - check that token was fetched
    // - check that schema was fetched
    // - check that farm_global was created
    // - check that token is saved in local storage
    // - check that schema is saved in session storage

    cy.intercept('POST', 'oauth/token').as('getToken');
    cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

    farmosUtil.clearFarmGlobal();
    sessionStorage.clear();
    localStorage.clear();
    expect(farmosUtil.getFarmGlobal()).to.be.null;
    expect(localStorage.getItem('token')).to.be.null;
    expect(sessionStorage.getItem('schema')).to.be.null;

    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      expect(newFarm).to.not.be.null;
      expect(newFarm.remote.getToken()).to.not.be.null;
      expect(newFarm.schema.get()).to.not.be.null;

      useFarm(newFarm);

      cy.get('@getToken.all').should('have.length', 1);
      cy.get('@fetchSchema.all').should('have.length.at.least', 23); // base farmOS

      expect(farmosUtil.getFarmGlobal()).to.not.be.null;
      prev_farm = newFarm;
      expect(localStorage.getItem('token')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });
  });

  it('Test writing to farmOS.', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      // Create a log in farmOS.
      const p1 = {
        type: 'log--activity',
        name: 'test log',
        notes: 'testing writes to farmOS',
      };
      const a1 = newFarm.log.create(p1);
      cy.wrap(newFarm.log.send(a1)).as('sendLog');

      cy.get('@sendLog').then(() => {
        // fetch the created log.
        cy.wrap(
          newFarm.log
            .fetch({
              filter: { type: 'log--activity', id: a1.id },
            })
            .then((res) => {
              return res.data[0];
            })
        ).as('fetchLog');
      });

      cy.get('@fetchLog')
        .then((log) => {
          expect(log.type).to.equal('log--activity');
          expect(log.id).to.equal(a1.id);
          expect(log.attributes.name).to.equal('test log');
          expect(log.attributes.notes.value).to.equal(
            'testing writes to farmOS'
          );
          return log.id;
        })
        .then((id) => {
          // delete the log.
          cy.wrap(newFarm.log.delete('activity', id));
        });
    });
  });

  it.only('Creates new farmOSInstance when user changes.', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then((adminFarm) => {
      cy.wrap(
        farmosUtil.getFarmOSInstance(
          'http://farmos',
          'farm',
          'guest',
          'farmdata2'
        )
      ).then((guestFarm) => {
        expect(guestFarm).to.not.equal(adminFarm);

        cy.wrap(guestFarm.user.fetch({ filter: { type: 'user--user' } })).as(
          'fetchUsers'
        );
      });
    });

    cy.get('@fetchUsers').then((users) => {
      expect(users.data.length).to.equal(10);
      // The guest user does not get role data when fetching but admin does.
      expect(users.data[2].relationships.roles).to.not.exist;
    });
  });

  /*
   * Note: We only have one farmOS server and one client in that server so
   * we can't really test for the cases where the hostURL or the client
   * changes.  However, they are handled in the same place as the user change
   * so if that works, we can have high confidence that the others work.
   *
   * They are also unlikely use cases.
   */
});
