import dayjs from 'dayjs';

describe('Soil Disturbance: Submit/Reset Buttons component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/soil_disturbance/');

    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Buttons exist, are visible, and are enabled', () => {
    cy.get('[data-cy="submit-button"]')
      .should('be.visible')
      .should('be.enabled');
    cy.get('[data-cy="reset-button"]')
      .should('be.visible')
      .should('be.enabled');
  });

  function populateForm({ skipLocation = false, skipEquipment = false } = {}) {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');
    if (!skipLocation) {
      cy.get('[data-cy="soil-disturbance-location"]')
        .find('[data-cy="selector-input"]')
        .select('ALF');
      cy.get('[data-cy="picklist-checkbox-0"]').check();
      cy.get('[data-cy="picklist-checkbox-1"]').check();
    }
    if (!skipEquipment) {
      cy.get('[data-cy="multi-equipment-selector"]')
        .find('[data-cy="selector-1"]')
        .find('[data-cy="selector-input"]')
        .select('Tractor');
      cy.get('[data-cy="soil-disturbance-equipment-form"]')
        .find('[data-cy="soil-disturbance-depth"]')
        .clear();
      cy.get('[data-cy="soil-disturbance-equipment-form"]')
        .find('[data-cy="soil-disturbance-depth"]')
        .type(5);
      cy.get('[data-cy="soil-disturbance-equipment-form"]')
        .find('[data-cy="soil-disturbance-speed"]')
        .clear();
      cy.get('[data-cy="soil-disturbance-equipment-form"]')
        .find('[data-cy="soil-disturbance-speed"]')
        .type(6);
      cy.get('[data-cy="soil-disturbance-equipment-form"]')
        .find('[data-cy="soil-disturbance-passes"]')
        .clear();
      cy.get('[data-cy="soil-disturbance-equipment-form"]')
        .find('[data-cy="soil-disturbance-passes"]')
        .type(3);
    }
    cy.get('[data-cy="comment-input"]').type('This is a comment');
    cy.get('[data-cy="comment-input"]').blur();
  }

  it('Invalid date disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="date-input"]').type('1950-01-02');
    cy.get('[data-cy="date-input"]').blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid location disables submit', () => {
    populateForm({ skipLocation: true });
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid depth disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type(6);
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid speed disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type(6);
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid area disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .type(6);
    cy.get('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid passes disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-input"]')
      .type(6);
    cy.get('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Equipment selection validation', () => {
    populateForm({ skipEquipment: true });
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Reset button resets form', () => {
    populateForm();
    cy.get('[data-cy="reset-button"]').click();

    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );

    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="soil-disturbance-depth"]').should('not.exist');
    cy.get('[data-cy="soil-disturbance-speed"]').should('not.exist');
    cy.get('[data-cy="soil-disturbance-area"]').should('not.exist');
    cy.get('[data-cy="soil-disturbance-passes"]').should('not.exist');
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');

    cy.get('[data-cy="comment-input"]').should('have.value', '');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });
});
