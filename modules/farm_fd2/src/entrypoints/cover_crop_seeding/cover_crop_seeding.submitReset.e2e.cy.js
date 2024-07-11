import dayjs from 'dayjs';

describe('Cover Crop Seeding: Submit/Reset Buttons component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/cover_crop_seeding/');

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

  function populateForm({ skipCrop = false, skipLocation = false } = {}) {
    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="date-input"]').type('1950-01-02');

    if (!skipLocation) {
      cy.get('[data-cy="location-selector"]')
        .find('[data-cy="selector-input"]')
        .select('ALF');
      cy.get('[data-cy="picker-group"]').find('input').eq(0).check();
      cy.get('[data-cy="picker-group"]').find('input').eq(2).check();
    }

    if (!skipCrop) {
      cy.get('[data-cy="multi-crop-selector"]')
        .find('[data-cy="selector-1"]')
        .find('[data-cy="selector-input"]')
        .select('ARUGULA');
      cy.get('[data-cy="multi-crop-selector"]')
        .find('[data-cy="selector-2"]')
        .find('[data-cy="selector-input"]')
        .select('BEAN');
    }

    cy.get('[data-cy="winter-kill-checkbox"]').check();
    cy.get('[data-cy="winter-kill-date-input"]').type('1951-01-02');

    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-title"]'
    ).click();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('1');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('2');

    cy.get(
      '[data-cy="cover-crop-seeding-seed-incorporation-accordion-title"]'
    ).click();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Portable Broadcaster');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('3');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('4');

    cy.get('[data-cy="comment-input"]').type('test comment');
    cy.get('[data-cy="comment-input"]').blur();
  }

  it('Invalid date disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="date-input"]').type('2020-01-01');
    cy.get('[data-cy="date-input"]').blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid location disables submit', () => {
    populateForm({ skipLocation: true });

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .type('1');

    cy.get('[data-cy="location-selector"]')
      .find('[data-cy="selector-input"]')
      .select('A');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid crop disables submit', () => {
    populateForm({ skipCrop: true });

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid area seeded disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .type('1');
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid winter kill date disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="winter-kill-checkbox"]').check();
    cy.get('[data-cy="winter-kill-date-input"]').clear();
    cy.get('[data-cy="winter-kill-date-input"]').blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="winter-kill-date-input"]').type('2020-01-01');
    cy.get('[data-cy="winter-kill-date-input"]').blur();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid seed application depth disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('1');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid seed application speed disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('2');
    cy.get('[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid seed incorporation depth disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .type('1');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Invalid seed incorporation speed disables submit', () => {
    populateForm();

    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .type('2');
    cy.get('[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Reset button resets form', () => {
    populateForm();
    cy.get('[data-cy="reset-button"]').click();

    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );

    cy.get('[data-cy="location-selector"]').should('have.value', '');
    cy.get('[data-cy="picker-group"]').should('not.exist');

    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="multi-crop-selector"]')
      .find('[data-cy="selector-2"]')
      .should('not.exist');

    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-input"]').should('not.exist');

    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]'
    ).should('not.be.visible');
    cy.get(
      '[data-cy="cover-crop-seeding-seed-incorporation-soil-disturbance"]'
    ).should('not.be.visible');

    cy.get('[data-cy="comment-input"]').should('have.value', '');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });
});
