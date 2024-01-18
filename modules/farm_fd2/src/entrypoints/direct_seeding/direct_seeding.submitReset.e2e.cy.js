import dayjs from 'dayjs';

describe('Direct Seeding: Submit/Reset Buttons component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/direct_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Buttons exist, are visible, are enabled', () => {
    cy.get('[data-cy="submit-button"]')
      .should('be.visible')
      .should('be.enabled');
    cy.get('[data-cy="reset-button"]')
      .should('be.visible')
      .should('be.enabled');
  });

  function populateForm({ skipCrop = false, skipLocation = false } = {}) {
    if (!skipCrop) {
      cy.get('[data-cy="direct-seeding-crop"]')
        .find('[data-cy="selector-input"]')
        .select('ARUGULA');
    }
    if (!skipLocation) {
      cy.get('[data-cy="direct-seeding-location"]')
        .find('[data-cy="selector-input"]')
        .select('A');
    }

    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]').click();
    cy.get('[data-cy="direct-seeding-equipment-selector"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
  }

  it('Invalid date disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="direct-seeding-date"]').clear();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Invalid crop disables submit', () => {
    populateForm({ skipCrop: true });
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Invalid location disables submit', () => {
    populateForm({ skipLocation: true });
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Invalid bed feet disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Invalid bed width disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="direct-seeding-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="direct-seeding-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  // Note: There is no way to make Rows/Bed invalid.

  it('Invalid depth disables submit if equipment is selected', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="direct-seeding-soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="direct-seeding-soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-delete-button"]')
      .click();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid speed disables submit if equipment is selected', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-delete-button"]')
      .click();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Reset button resets form', () => {
    populateForm();
    cy.get('[data-cy="reset-button"]').click();

    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
    cy.get('[data-cy="direct-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);

    cy.get('[data-cy="direct-seeding-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
    cy.get('[data-cy="direct-seeding-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '60');
    cy.get('[data-cy="direct-seeding-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', '1');

    cy.get('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="direct-seeding-soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
  });
});
