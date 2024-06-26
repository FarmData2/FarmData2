describe('Cover Crop Seeding: MultiCropSelector Component', () => {
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

  it('MultiCropSelector exists, is visible, is enabled', () => {
    cy.get('[data-cy="cover-crop-seeding-crops"]').should('exist');
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('MultiCropSelector props are correct', () => {
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('MultiCropSelector validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-invalid');
  });

  it('Add new crop selector and check', () => {
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="crop-selector-1"] [data-cy="selector-input"]')
      .select('BEAN');
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="crop-selector-2"] [data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Remove crop selector and validate', () => {
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="crop-selector-1"] [data-cy="selector-input"]')
      .select('BEAN');
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="crop-selector-2"] [data-cy="selector-input"]')
      .select('BEAN');
    cy.get('[data-cy="selector-delete-button"]').click();
    cy.get('[data-cy="cover-crop-seeding-crops"]')
      .find('[data-cy="crop-selector-3"]')
      .should('not.exist');
  });
});
