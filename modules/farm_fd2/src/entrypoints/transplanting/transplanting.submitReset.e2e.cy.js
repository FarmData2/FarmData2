import dayjs from 'dayjs';

describe('Transplanting: Submit/Reset Buttons component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/transplanting/');
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
      cy.get('[data-cy="transplanting-picklist"]')
        .find('[data-cy="selector-input"]')
        .select('LETTUCE-ICEBERG');
      cy.get(`[data-cy="picklist-quantity-4"]`).select(2);
    }
    if (!skipLocation) {
      cy.get('[data-cy="transplanting-location"]')
        .find('[data-cy="selector-input"]')
        .select('ALF');
      cy.get('[data-cy="transplanting-location"]')
        .find('[data-cy="picker-options"]')
        .find('input')
        .eq(0)
        .click();
      cy.get('[data-cy="transplanting-location"]')
        .find('[data-cy="picker-options"]')
        .find('input')
        .eq(3)
        .click();
    }

    cy.get(
      '[data-cy="transplanting-soil-disturbance-accordion-title"]'
    ).click();
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');

    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('6');
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('3');

    cy.get('[data-cy="comment-input"]').clear();
    cy.get('[data-cy="comment-input"]').type('Test comment');
    cy.get('[data-cy="comment-input"]').blur();
  }

  it('Invalid date disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="date-input"]').type('2024-05-30');
    cy.get('[data-cy="date-input"]').blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid crop disables submit', () => {
    populateForm({ skipCrop: true });
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .select('LETTUCE-ICEBERG');
    cy.get('[data-cy="transplanting-picklist"]');
    cy.get(`[data-cy="picklist-quantity-4"]`).select(2);
    cy.get(`[data-cy="picklist-quantity-4"]`);
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid location disables submit', () => {
    populateForm({ skipLocation: true });
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .click();
    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(3)
      .click();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid bed feet disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .type(3);
    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid bed width disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .type(5);
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  // Note: There is no way to make Rows/Bed invalid.

  it('Invalid depth disables submit if equipment is selected', () => {
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
      .type(9);
    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Checks submit button enables after deleting equipment with invalid depth', () => {
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

    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-delete-button"]')
      .click();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid speed disables submit if equipment is selected', () => {
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
      .type(15);
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Checks submit button enables after deleting equipment with invalid speed', () => {
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

    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
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
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);

    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="picker-options"]')
      .should('not.exist');

    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .should('not.be.checked');
    cy.get('[data-cy="transplanting-location"]')
      .find('[data-cy="picker-options"]')
      .find('input')
      .eq(3)
      .should('not.be.checked');

    cy.get('[data-cy="transplanting-bed-feet"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
    cy.get('[data-cy="transplanting-bed-width"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '60');
    cy.get('[data-cy="transplanting-rows-per-bed"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', '1');

    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="soil-disturbance-depth"]').should('not.exist');
    cy.get('[data-cy="soil-disturbance-speed"]').should('not.exist');
    cy.get('[data-cy="soil-disturbance-area"]').should('not.exist');

    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');

    cy.get('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
    cy.get('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.0');
  });
});
