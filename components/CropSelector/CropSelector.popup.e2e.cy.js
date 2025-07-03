describe('CropSelector popup test', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('/fd2/tray_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Form selects new crop', () => {
    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="selector-popupIframe"]', { timeout: 10000 })
      .should('be.visible')
      .its('0.contentDocument.body', { timeout: 10000 })
      .should('not.be.empty')
      .then(cy.wrap)
      .as('iframeBody');

    cy.get('@iframeBody')
      .find('[id="edit-name-0-value"]', { timeout: 10000 })
      .should('be.visible') // Ensure the input field is visible
      .type('NewCrop');

    cy.get('@iframeBody')
      .find('[id="edit-submit"]', { timeout: 10000 })
      .should('be.visible') // Ensure the submit button is visible
      .click();

    cy.get('[data-cy="tray-seeding-crop"]')
      .find('[data-cy="selector-input"]', { timeout: 10000 })
      .should('have.value', 'NewCrop');
  });
});
