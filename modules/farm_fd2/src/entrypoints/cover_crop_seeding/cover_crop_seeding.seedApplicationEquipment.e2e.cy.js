describe('Cover Crop Seeding: Seed Application Equipment Component', () => {
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

  it('Seed application accordion exists, is visible, is collapsed', () => {
    cy.get('[data-cy="cover-crop-seeding-seed-application-accordion"]').should(
      'be.visible'
    );
    cy.get('[data-cy="cover-crop-seeding-seed-application-accordion-title"]')
      .should('be.visible')
      .should('contain.text', 'Seed Application Equipment');
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-item"]'
    ).should('not.be.visible');
  });

  it('Seed application accordion expands to show equipment selector', () => {
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-title"]'
    ).click();

    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-title"]'
    ).click();
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-item"]'
    ).should('be.visible');
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"]'
    ).should('be.visible');
  });

  it('Validity styling not shown in Seed Application Equipment component', () => {
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-title"]'
    ).click();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="multi-equipment-selector"')
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid');
  });

  it('Proper numeric fields appear when equipment is selected', () => {
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-accordion-title"]'
    ).click();
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"] [data-cy="multi-equipment-selector"]'
    )
      .find('[data-cy="selector-1"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');

    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"] [data-cy="soil-disturbance-depth"]'
    ).should('be.visible');
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"] [data-cy="soil-disturbance-speed"]'
    ).should('be.visible');
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"] [data-cy="soil-disturbance-area"]'
    ).should('not.exist');
    cy.get(
      '[data-cy="cover-crop-seeding-seed-application-soil-disturbance"] [data-cy="soil-disturbance-passes"]'
    ).should('not.exist');
  });
});
