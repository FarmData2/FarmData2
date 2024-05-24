//import { lib } from './lib.js';

describe('Tray Seeding: Submission tests', () => {
  before(() => {});

  beforeEach(() => {
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
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');
    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');

    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .type('10');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .select('50');
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .type('3');

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
  }

  it('Test successful submission', () => {
    /*
     * Create a spy to watch for the seeding log, which is the
     * last thing created by the lib.submitForm function that is
     * called when the "Submit" button is clicked.
     */
    cy.intercept('POST', '**/api/log/seeding', cy.spy().as('submitSpy'));

    cy.window().then((win) => {
      console.log(win);
      cy.spy(win, 'libForm').as('submitFuncSpy');
    });

    /*
     * Fill in the form and click the "Submit" button.
     */
    submitForm();

    // Check for the status toast while the form is submitting.
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting tray seeding...');

    // Give time for all the records to be created.
    cy.get('.toast', { timeout: 10000 }).should(
      'contain.text',
      'Tray seeding created.'
    );

    /*
     * Ensure that the lib.submitForm function was called.
     * No need to check the db for the records as the lib unit tests
     * already do that.
     */
    cy.get('@submitSpy').should('be.called');

    cy.get('@submitFuncSpy').should('be.called');

    // Check that the "sticky" parts of the form are not reset...
    cy.get('[data-cy="date-input"]').should('have.value', '1950-01-02');
    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', 'CHUAU');

    // Check that the other parts of the form are reset.
    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');
    cy.get('[data-cy="tray-seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
    cy.get('[data-cy="comment-input"]').should('have.value', '');

    // Finally check that the toast is hidden.
    cy.get('.toast').should('not.exist');
  });

  it('Test submission with network error', () => {
    cy.intercept('POST', '**/api/log/seeding', {
      statusCode: 401,
    });
    submitForm();
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Submitting tray seeding...');
    cy.get('.toast')
      .should('be.visible')
      .should('contain.text', 'Error creating tray seeding.');
    cy.get('.toast', { timeout: 7000 }).should('not.exist');
  });
});
