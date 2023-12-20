import * as farmosUtil from '../../../../../library/farmosUtil/farmosUtil';

describe('Check the submission of Tray Seedings.', () => {
  beforeEach(() => {
    /*
     * Caching of the farmOS instance and the data for the maps relies
     * on the session storage and local storage.  Cypress clears these
     * between every test.  So we save them in the afterEach() hook,
     * and then restore them in the beforeEach() hook.
     */
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/tray_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  function submitForm() {
    cy.get('[data-cy="date-input"]').type('1950-01-01');
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .type('15');
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .select('50');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .type('3');
    cy.get('[data-cy="comment-input"]').clear();
    cy.get('[data-cy="comment-input"]').type('Test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it('Submit a Tray Seeding.', () => {
    submitForm();

    cy.get('.toast').should('be.visible');
    cy.get('.toast').contains('Submitting tray seeding...');

    let name = '1950-01-01_ts_ARUGULA';
    cy.get('.toast')
      .contains('Tray seeding created.')
      .then(() => {
        cy.wrap(farmosUtil.getFarmOSInstance()).as('farm');
      });

    cy.get('@farm').then((farm) => {
      let logFilter = { type: 'log--seeding', name: name };

      cy.wrap(farm.log.fetch({ filter: logFilter }))
        .then((results) => {
          expect(results.fulfilled.length).to.equal(1);
          expect(results.rejected.length).to.equal(0);
          return results.data[0];
        })
        .then((log) => {
          expect(log.attributes.name).to.equal(name);
          expect(log.attributes.timestamp).to.contain('1950-01-01');
          expect(log.relationships.quantity.length).to.equal(3);
          return log;
        })
        .then(() => {
          // Check that the "sticky" parts of the form are not reset...
          cy.get('[data-cy="date-input"]').should('have.value', '1950-01-01');
          cy.get('[data-cy="seeding-location-name"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'CHUAU');

          // And that the toast is hidden.
          cy.get('.toast', { timeout: 7000 }).should('not.exist');
        });

      /*
       * Note: Deleting the asset must come after deleting the log,
       * because the asset is referenced by the log. But Cypress does
       * not guarantee that when two async functions are invoked with
       * cy.wrap() calls will execute in the order they are written.
       * So the cy.get() here ensures that the log is deleted before
       * the asset is deleted.
       *
       * See: https://docs.cypress.io/api/commands/wrap#Promises
       */
      let plantFilter = { type: 'asset--plant', name: name };

      cy.wrap(farm.asset.fetch({ filter: plantFilter }))
        .then((results) => {
          expect(results.fulfilled.length).to.equal(1);
          expect(results.rejected.length).to.equal(0);
          return results.data[0];
        })
        .then((log) => {
          expect(log.attributes.name).to.equal(name);
          expect(log.attributes.status).to.equal('active');
          return log;
        });
    });
  });

  it('Test error on submission.', () => {
    // Generate an error in the creation of the plant asset.
    cy.intercept('POST', '**/api/asset/plant', {
      statusCode: 401,
    });

    submitForm();

    cy.get('.toast').should('be.visible');
    cy.get('.toast').contains('Error creating tray seeding.');
    cy.get('.toast', { timeout: 10000 }).should('not.exist');

    // Check that form is still populated...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-01');
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'ARUGULA');
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'CHUAU');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '15.00');
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', '50');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '3');
    cy.get('[data-cy="comment-input"]').should('have.value', 'Test comment');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });
});
