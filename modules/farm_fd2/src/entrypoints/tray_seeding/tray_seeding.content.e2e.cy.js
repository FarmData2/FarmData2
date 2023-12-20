import dayjs from 'dayjs';

describe('Check the content of the Tray Seeding page.', () => {
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

  it('Check header.', () => {
    cy.get('[data-cy="seeding-header"]').should('contain.text', 'Tray Seeding');
  });

  it('All components are visible.', () => {
    cy.get('[data-cy="seeding-date"]').should('be.visible');
    cy.get('[data-cy="seeding-crop-name"]').should('be.visible');
    cy.get('[data-cy="seeding-location-name"]').should('be.visible');
    cy.get('[data-cy="seeding-trays"]').should('be.visible');
    cy.get('[data-cy="seeding-tray-size"]').should('be.visible');
    cy.get('[data-cy="seeding-seeds"]').should('be.visible');
    cy.get('[data-cy="seeding-total-seeds"]').should('be.visible');
    cy.get('[data-cy="seeding-comment"]').should('be.visible');
    cy.get('[data-cy="seeding-submit-reset"]').should('be.visible');
  });

  it('Check date field.', () => {
    /*
     * There is only one 'date-label', 'date-required', and 'date-input' on
     * the page, so we can cy.get() them directly without first getting their
     * parent element.  Compare this with the crop field test below.
     */
    cy.get('[data-cy="date-label"]').should('have.text', 'Date:');
    cy.get('[data-cy="date-required"]').should('be.visible');
    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
  });

  it('Check crop field.', () => {
    /*
     * The crop, location and tray size dropdowns area all made using
     * the `SelectorBase` component.  Thus, they will all have
     * `selector-label, selector-required` and `selector-input` elements.
     * Thus, to get the right one we first have to get the parent element
     * (e.g. `seeding-crop-name`) and then use find() within it to get
     * the specific `selector-label`, `selector-required` or `selector-input`
     * that we want.  See the similar pattern below for the location and
     * tray size fields.  Note also that the Trays and Seeds/Cell fields
     * follow a similar pattern because they are built using the `NumericBase`
     * component.
     */
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-label"]')
      .should('have.text', 'Crop:');
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="seeding-crop-name"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Check location field.', () => {
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-label"]')
      .should('have.text', 'Location:');
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Check that location contains only greenhouses.', () => {
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-input"]')
      .find('option')
      .should('have.length', 6);
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-option-1"]')
      .should('have.value', 'CHUAU');
    cy.get('[data-cy="seeding-location-name"]')
      .find('[data-cy="selector-option-5"]')
      .should('have.value', 'SEEDING BENCH');
  });

  it('Check trays field.', () => {
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-label"]')
      .should('have.text', 'Trays:');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1.00');

    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-increase-sm"]')
      .should('exist');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-increase-md"]')
      .should('exist');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-increase-lg"]')
      .should('exist');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .should('exist');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-md"]')
      .should('exist');
    cy.get('[data-cy="seeding-trays"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .should('exist');
  });

  it('Check tray size field', () => {
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-label"]')
      .should('have.text', 'Tray Size:');
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="seeding-tray-size"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Check seeds per cell field.', () => {
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-label"]')
      .should('have.text', 'Seeds/Cell:');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');

    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-increase-sm"]')
      .should('exist');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-increase-md"]')
      .should('not.exist');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-increase-lg"]')
      .should('not.exist');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .should('exist');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-decrease-md"]')
      .should('not.exist');
    cy.get('[data-cy="seeding-seeds"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .should('not.exist');
  });

  it('Check total seeds.', () => {
    cy.get('[data-cy="seeding-total-seeds"]')
      .find('[data-cy="text-label"]')
      .should('have.text', 'Total Seeds:');
    cy.get('[data-cy="seeding-total-seeds"]')
      .find('[data-cy="text-text"]')
      .should('have.value', '');
  });

  it('Check comment field.', () => {
    cy.get('[data-cy="comment-input"]').should('have.value', '');
  });

  it('Check submit and reset buttons.', () => {
    cy.get('[data-cy="submit-button"]').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.enabled');
    cy.get('[data-cy="reset-button"]').should('be.visible');
    cy.get('[data-cy="reset-button"]').should('be.enabled');
  });
});
