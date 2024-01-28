import dayjs from 'dayjs';

describe('Tray Seeding: Submit/Reset Buttons component', () => {
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

  it('Buttons exist, are visible, are enabled', () => {
    cy.get('[data-cy="submit-button"]')
      .should('be.visible')
      .should('be.enabled');
    cy.get('[data-cy="reset-button"]')
      .should('be.visible')
      .should('be.enabled');
  });

  function populateForm({
    skipCrop = false,
    skipLocation = false,
    skipTraySize = false,
  } = {}) {
    if (!skipCrop) {
      cy.get('[data-cy="tray-seeding-crop"]')
        .find('[data-cy="selector-input"]')
        .select('ARUGULA');
    }
    if (!skipLocation) {
      cy.get('[data-cy="tray-seeding-location"]')
        .find('[data-cy="selector-input"]')
        .select('CHUAU');
    }
    if (!skipTraySize) {
      cy.get('[data-cy="tray-seeding-tray-size"]')
        .find('[data-cy="selector-input"]')
        .select('50');
    }
  }

  it('Invalid date disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="tray-seeding-date"]').clear();
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

  it('Invalid trays disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="tray-seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Invalid tray size disables submit', () => {
    populateForm({ skipTraySize: true });
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Invalid seeds per cell disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="tray-seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('Reset button resets form', () => {
    populateForm();
    cy.get('[data-cy="reset-button"]').click();

    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="tray-seeding-location"]')
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
  });
});
