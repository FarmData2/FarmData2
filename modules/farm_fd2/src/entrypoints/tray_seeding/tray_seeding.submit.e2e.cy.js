import * as farmOS from 'farmos';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

let farm = null;

describe('Check the submission of Tray Seedings.', () => {
  beforeEach(() => {
    farm = farmosUtil.getFarmOSInstance();

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

  it('Submit a Tray Seeding.', () => {
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

    cy.get('[data-cy="seeding-submit-button"]').click();

    let name = '1950-01-01_ts_ARUGULA';
    cy.wrap(
      farm.asset.fetch({ type: 'asset--plant', name: name }).then((results) => {
        expect(results.data[0].attributes.status).to.equal('active');
        expect(results.data[0].attributes.notes.value).to.equal('Test comment');
      })
    );
  });
});
