import dayjs from 'dayjs';

describe('Check the behavior of the Tray Seeding page.', () => {
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

  it('Submit shows validity styling', () => {
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-invalid-feedback"]')
      .should('not.be.visible');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-invalid-feedback"]')
      .should('be.visible');
  });

  it('Submit invalid disables submit but not reset', () => {
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });

  it('Form becomes valid reenables submit', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-input"]')
      .select('ARUGULA');
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .select('50');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Reset clears form to defaults', () => {
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

    cy.get('[data-cy="reset-button"]').click();

    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
    cy.get('[data-cy="comment-input"]').should('have.value', '');
  });

  it('Reset re-enables Submit button', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');
    cy.get('[data-cy="reset-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  it('Trays increment/decrement are 1, 5, 10', () => {
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '2.00');

    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-increase-md"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '7.00');

    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-increase-lg"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '17.00');

    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '16.00');

    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '11.00');

    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');
  });

  it('Trays has 0.01 minimum value', () => {
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '0.01');
  });

  it('Seeds/Cell increment/decrement is 1', () => {
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '2');

    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
  });

  it('Seeds/Cell has 1 minimum value', () => {
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
  });

  it('Total seeds is computed correctly', () => {
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .type('10');

    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .select('50');

    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .type('3');

    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .blur();

    cy.get('[data-cy="seeding-total-seeds"]')
      .find('[data-cy="text-text"]')
      .should('have.value', '1,500');
  });
});
