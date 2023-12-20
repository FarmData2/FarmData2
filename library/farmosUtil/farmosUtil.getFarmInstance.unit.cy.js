import * as farmosUtil from './farmosUtil.js';

describe('Test getFarmOSInstance', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  // Use the farm instance to fetch data to be sure it is valid.
  async function useFarm(farm) {
    await farm.user
      .fetch({
        filter: {
          type: 'user--user',
        },
      })
      .then((resp) => {
        expect(resp.data).to.not.be.null;
        expect(resp.data.length).to.equal(10);
        expect(resp.data[0].type).to.equal('user--user');
        expect(resp.data[2].attributes.display_name).to.equal('manager1');
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

    farmosUtil.clearFarmGlobal();
    localStorage.clear();
    sessionStorage.clear();

    expect(farmosUtil.getFarmGlobal()).to.be.null;
    expect(localStorage.getItem('token')).to.be.null;
    expect(sessionStorage.getItem('schema')).to.be.null;

    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('originalFarm')
      .then(() => {
        cy.wrap(farmosUtil.getFarmOSInstance()).as('newFarm');
      });

    cy.get('@newFarm').then((newFarm) => {
      expect(newFarm).to.not.be.null;
      expect(newFarm.remote.getToken()).to.not.be.null;
      expect(newFarm.schema.get()).to.not.be.null;

      cy.get('@getToken.all').should('have.length', 1);
      cy.get('@fetchSchema.all').should('have.length.at.least', 23); // base farmOS

      expect(farmosUtil.getFarmGlobal()).to.not.be.null;
      expect(localStorage.getItem('farmOStoken')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;

      cy.wrap(useFarm(newFarm));
    });

    cy.getAll(['@originalFarm', '@newFarm']).then(([originalFarm, newFarm]) => {
      expect(originalFarm === newFarm).to.be.true;
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

      cy.wrap(farmosUtil.getFarmOSInstance())
        .as('originalFarm')
        .then(() => {
          expect(farmosUtil.getFarmGlobal()).to.not.be.null;
          expect(localStorage.getItem('farmOStoken')).to.not.be.null;
          expect(sessionStorage.getItem('schema')).to.not.be.null;

          cy.intercept('POST', 'oauth/token').as('getToken');
          cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

          cy.wrap(farmosUtil.getFarmOSInstance()).as('secondFarm');
        });

      cy.get('@secondFarm').then((secondFarm) => {
        expect(secondFarm).to.not.be.null;
        expect(secondFarm.remote.getToken()).to.not.be.null;
        expect(secondFarm.schema.get()).to.not.be.null;

        cy.get('@getToken.all').should('have.length', 0);
        cy.get('@fetchSchema.all').should('have.length', 0);

        expect(localStorage.getItem('farmOStoken')).to.not.be.null;
        expect(sessionStorage.getItem('schema')).to.not.be.null;

        cy.wrap(useFarm(secondFarm));
      });

      cy.getAll(['@originalFarm', '@secondFarm']).then(
        ([originalFarm, secondFarm]) => {
          expect(originalFarm === secondFarm).to.be.true;
        }
      );
    }
  );

  it('Clear the local storage.', { retries: 4 }, () => {
    // Clear localStorage
    // - check that farm global exists
    // - Check that schema is in session storage
    // - check that token is not in local storage.
    // - Get a farm object
    // - check it has token & schema
    // - check it is a different farm object as last instance
    // - check that it can be used to get info from server
    // - check that it did fetch the token
    // - check that it did not fetch the schema
    // - check that token is saved in local storage
    // - check that schema is saved in session storage

    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('originalFarm')
      .then(() => {
        localStorage.clear();
        expect(farmosUtil.getFarmGlobal()).to.not.be.null;
        expect(localStorage.getItem('farmOStoken')).to.be.null;
        expect(sessionStorage.getItem('schema')).to.not.be.null;

        cy.intercept('POST', 'oauth/token').as('getToken');
        cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

        cy.wrap(farmosUtil.getFarmOSInstance()).as('secondFarm');
      });

    cy.get('@secondFarm').then((secondFarm) => {
      expect(secondFarm).to.not.be.null;
      expect(secondFarm.remote.getToken()).to.not.be.null;
      expect(secondFarm.schema.get()).to.not.be.null;

      cy.get('@getToken.all').should('have.length', 1);
      cy.get('@fetchSchema.all').should('have.length', 0);

      expect(localStorage.getItem('farmOStoken')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;

      cy.wrap(useFarm(secondFarm));
    });

    cy.getAll(['@originalFarm', '@secondFarm']).then(
      ([originalFarm, secondFarm]) => {
        // Need to create a whole new farmOS object in this case.
        expect(originalFarm != secondFarm).to.be.true;
      }
    );
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

    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('originalFarm')
      .then(() => {
        farmosUtil.clearFarmGlobal();
        expect(farmosUtil.getFarmGlobal()).to.be.null;
        expect(localStorage.getItem('farmOStoken')).to.not.be.null;
        expect(sessionStorage.getItem('schema')).to.not.be.null;

        cy.intercept('POST', 'oauth/token').as('getToken');
        cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

        cy.wrap(farmosUtil.getFarmOSInstance()).as('secondFarm');
      });

    cy.get('@secondFarm').then((secondFarm) => {
      expect(secondFarm).to.not.be.null;
      expect(secondFarm.remote.getToken()).to.not.be.null;
      expect(secondFarm.schema.get()).to.not.be.null;

      cy.wrap(useFarm(secondFarm));

      cy.get('@getToken.all').should('have.length', 0);
      cy.get('@fetchSchema.all').should('have.length', 0);

      expect(localStorage.getItem('farmOStoken')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });

    cy.getAll(['@originalFarm', '@secondFarm']).then(
      ([originalFarm, secondFarm]) => {
        expect(originalFarm != secondFarm).to.be.true;
      }
    );
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

    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('originalFarm')
      .then(() => {
        farmosUtil.clearFarmGlobal();
        sessionStorage.clear();
        expect(farmosUtil.getFarmGlobal()).to.be.null;
        expect(localStorage.getItem('farmOStoken')).to.not.be.null;
        expect(sessionStorage.getItem('schema')).to.be.null;

        cy.intercept('POST', 'oauth/token').as('getToken');
        cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

        cy.wrap(farmosUtil.getFarmOSInstance()).as('secondFarm');
      });

    cy.get('@secondFarm').then((secondFarm) => {
      expect(secondFarm).to.not.be.null;
      expect(secondFarm.remote.getToken()).to.not.be.null;
      expect(secondFarm.schema.get()).to.not.be.null;

      cy.wrap(useFarm(secondFarm));

      cy.get('@getToken.all').should('have.length', 0);
      cy.get('@fetchSchema.all').should('have.length.at.least', 23); // base farmOS

      expect(localStorage.getItem('farmOStoken')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });

    cy.getAll(['@originalFarm', '@secondFarm']).then(
      ([originalFarm, secondFarm]) => {
        expect(originalFarm != secondFarm).to.be.true;
      }
    );
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

    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('originalFarm')
      .then(() => {
        farmosUtil.clearFarmGlobal();
        sessionStorage.clear();
        localStorage.clear();
        expect(farmosUtil.getFarmGlobal()).to.be.null;
        expect(localStorage.getItem('farmOStoken')).to.be.null;
        expect(sessionStorage.getItem('schema')).to.be.null;

        cy.intercept('POST', 'oauth/token').as('getToken');
        cy.intercept('GET', '**/api/**/schema').as('fetchSchema');

        cy.wrap(farmosUtil.getFarmOSInstance()).as('secondFarm');
      });

    cy.get('@secondFarm').then((secondFarm) => {
      expect(secondFarm).to.not.be.null;
      expect(secondFarm.remote.getToken()).to.not.be.null;
      expect(secondFarm.schema.get()).to.not.be.null;

      cy.wrap(useFarm(secondFarm));

      cy.get('@getToken.all').should('have.length', 1);
      cy.get('@fetchSchema.all').should('have.length.at.least', 23); // base farmOS

      expect(farmosUtil.getFarmGlobal()).to.not.be.null;
      expect(localStorage.getItem('farmOStoken')).to.not.be.null;
      expect(sessionStorage.getItem('schema')).to.not.be.null;
    });

    cy.getAll(['@originalFarm', '@secondFarm']).then(
      ([originalFarm, secondFarm]) => {
        expect(originalFarm != secondFarm).to.be.true;
      }
    );
  });

  it('Test writing to farmOS.', () => {
    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('newFarm')
      .then((newFarm) => {
        // Create a log in farmOS.
        const p1 = {
          type: 'log--activity',
          name: 'test log',
          notes: 'testing writes to farmOS',
        };
        const a1 = newFarm.log.create(p1);
        cy.wrap(newFarm.log.send(a1)).as('sendLog');
      });

    cy.getAll(['@newFarm', '@sendLog']).then(([newFarm, sendLog]) => {
      // fetch the created log.
      cy.wrap(
        newFarm.log
          .fetch({
            filter: { type: 'log--activity', id: sendLog.id },
          })
          .then((res) => {
            return res.data[0];
          })
      ).as('fetchLog');
    });

    cy.get('@fetchLog').then((fetchLog) => {
      expect(fetchLog.type).to.equal('log--activity');
      expect(fetchLog.id).to.equal(fetchLog.id);
      expect(fetchLog.attributes.name).to.equal('test log');
      expect(fetchLog.attributes.notes.value).to.equal(
        'testing writes to farmOS'
      );
    });
  });

  it('Test switching users.', () => {
    cy.wrap(farmosUtil.getFarmOSInstance())
      .as('adminFarm')
      .then((adminFarm) => {
        cy.wrap(adminFarm.user.fetch({ filter: { type: 'user--user' } })).as(
          'adminUsers'
        );
      })
      .then(() => {
        cy.wrap(
          farmosUtil.getFarmOSInstance(
            'http://farmos',
            'farm',
            'guest',
            'farmdata2'
          )
        )
          .as('guestFarm')
          .then((guestFarm) => {
            cy.wrap(
              guestFarm.user.fetch({ filter: { type: 'user--user' } })
            ).as('guestUsers');
          });
      });

    cy.get('@adminUsers').then((users) => {
      expect(users.data.length).to.equal(10);
      // The admin user gets role data when fetching.
      expect(users.data[2].relationships.roles).to.have.length(3);
    });

    cy.get('@guestUsers').then((users) => {
      expect(users.data.length).to.equal(10);
      // The guest user does not get role data when fetching but admin does.
      expect(users.data[2].relationships.roles).to.not.exist;
    });

    cy.getAll(['@adminFarm', '@guestFarm']).then(([adminFarm, guestFarm]) => {
      expect(adminFarm != guestFarm).to.be.true;
    });
  });

  it('Error when not all params are provided.', () => {
    cy.wrap(
      farmosUtil
        .getFarmOSInstance('http://farmos', 'farm')
        .then(() => {
          throw new Error('Should have thrown an error');
        })
        .catch((e) => {
          expect(e.message).to.contain(
            'Invalid arguments passed to getFarmOSInstance'
          );
        })
    );
  });
});
