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
});
