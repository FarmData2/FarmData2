describe('LocationSelector popup test', () => {
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

  it('Form selects new location for Tray Seeding', () => {
    cy.get('[data-cy="tray-seeding-location"]')
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
      .should('be.visible')
      .type('NewLocation');

    cy.get('@iframeBody').find('[id="edit-structure-type-greenhouse"]').check();

    cy.get('@iframeBody')
      .find('[id="edit-submit"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('[data-cy="tray-seeding-location"]')
      .find('[data-cy="selector-input"]', { timeout: 10000 })
      .should('have.value', 'NewLocation');
  });
});
