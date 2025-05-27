describe('Soil Disturbance: Equipment Component', () => {
  before(() => {
    cy.task('initDB');
  });

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

  it('Soil disturbance equipment header exists, is visible', () => {
    cy.get('[data-cy="soil-disturbance-equipment-title"]')
      .should('be.visible')
      .should('contain.text', 'Equipment');
  });

  it('Soil disturbance equipment body exists, is visible', () => {
    cy.get('[data-cy="soil-disturbance-equipment-form"]').should('be.visible');
  });

  it('Validity styling shown in soil disturbance component', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('not.have.class', 'is-valid')
      .should('have.class', 'is-invalid');
  });

  it('Proper numeric fields appear when equipment is selected', () => {
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');

    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .should('be.visible');
  });

  it('Equipment and numeric fields are required', () => {
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');

    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-depth"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-speed"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-passes"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
  });

  it('Updating beds updates area', () => {
    // no location chosen
    cy.get('[data-cy="multi-equipment-selector"]')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 100);

    // location with no active plant assets
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 100);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .eq(0)
      .should('be.checked')
      .wait(1000)
      .uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 50);
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .eq(1)
      .should('be.checked')
      .uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 1);
    cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 50);

    // Location with active plant assets (check)
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 1);

    // Area % updates
    cy.get('[data-cy="picklist-checkbox-1"]').check();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 25);

    // Only some crops in a bed are picked (partial selection), so that bed is not considered for the area %.
    cy.get('[data-cy="picklist-checkbox-2"]').check();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 75);

    // If all checkboxes are picked, the area percentage is 100%.
    cy.get('[data-cy="picklist-checkbox-0"]').check();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 100);

    // Location with active plant assets (uncheck)
    cy.get('[data-cy="picklist-checkbox-1"]').uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 75);

    cy.get('[data-cy="picklist-checkbox-2"]').uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 25);

    cy.get('[data-cy="picklist-checkbox-0"]').uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 1);

    // A location with active plant assets but no beds
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('G');
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 1);

    // Does not check the checkbox without the wait method
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.get('[data-cy="picklist-checkbox-0"]').wait(1000).check();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 50);

    cy.get('[data-cy="picklist-checkbox-1"]').check();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 100);

    cy.get('[data-cy="picklist-checkbox-0"]').uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 50);

    cy.get('[data-cy="picklist-checkbox-1"]').uncheck();
    cy.get('[data-cy="soil-disturbance-equipment-form"]')
      .find('[data-cy="soil-disturbance-area"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', 1);
  });
});
