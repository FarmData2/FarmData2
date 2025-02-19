describe('LocationSelector popup test on direct_seeding page', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('/fd2/direct_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Form selects new location for Direct Seeding - Bed with Parent ALF', () => {
    cy.get('[data-cy="direct-seeding-location"]')
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
      .type('NewLocationForDirectSeeding_Bed');

    cy.get('@iframeBody').find('[id="edit-land-type-bed"]').check();

    cy.get('@iframeBody')
      .find('[id="edit-parent-0-target-id"]')
      .should('be.visible')
      .type('alf');

    cy.get('@iframeBody')
      .find('.ui-menu .ui-menu-item a')
      .contains('ALF')
      .click();

    cy.get('@iframeBody')
      .find('[id="edit-submit"]', { timeout: 10000 })
      .should('be.visible') // Ensure the submit button is visible
      .click();

    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');

    cy.get('[data-cy="location-bed-picker"]')
      .find('[data-cy="picker-options"]')
      .contains('NewLocationForDirectSeeding_Bed')
      .should('exist');
  });

  it('Form selects new location for Direct Seeding - Field', () => {
    cy.get('[data-cy="direct-seeding-location"]')
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
      .type('NewLocationForDirectSeeding_Field');

    cy.get('@iframeBody').find('[id="edit-land-type-field"]').check();

    cy.get('@iframeBody')
      .find('[id="edit-submit"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('[data-cy="direct-seeding-location"]')
      .find('[data-cy="selector-input"]', { timeout: 10000 })
      .should('have.value', 'NewLocationForDirectSeeding_Field');
  });
});
