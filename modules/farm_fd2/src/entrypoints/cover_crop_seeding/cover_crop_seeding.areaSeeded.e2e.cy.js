describe('Cover Crop Seeding: Area Seeded Component', () => {
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

  it('Area Seeded exists, is visible, is enabled', () => {
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]').should('exist');
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Area Seeded props are correct', () => {
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-required"]')
      .should('be.visible');
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
  });

  it('Area Seeded has correct increment/decrement buttons.', () => {
    // Verify that the large increment/decrement buttons are not shown
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-decrease-lg"]')
      .should('not.exist');
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-increase-lg"]')
      .should('not.exist');

    // Test the medium and small increment/decrement buttons
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-decrease-md"]')
      .click();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '90');

    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-decrease-sm"]')
      .click();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '89');

    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-increase-sm"]')
      .click();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '90');

    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-increase-md"]')
      .click();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
  });

  it('Area Seeded has correct minimum value.', () => {
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .type(-5);
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '1');
  });

  it('Area Seeded has correct maximum value.', () => {
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .type(2000);
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .blur();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.value', '100');
  });

  it('Area Seeded validity styling works for valid input', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-valid');
  });

  it('Area Seeded validity styling works for invalid input', () => {
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .clear();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="cover-crop-seeding-area-seeded"]')
      .find('[data-cy="numeric-input"]')
      .should('have.class', 'is-invalid');
  });
});
