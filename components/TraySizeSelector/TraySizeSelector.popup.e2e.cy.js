describe('TraySizeSelector popup test', () => {
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

  it('Tray size plus button exists, is visible, is enabled', () => {
    cy.get('[data-cy="tray-size-selector"]')
      .find('[data-cy="selector-add-button"]')
      .should('exist')
      .should('be.visible')
      .should('be.enabled');
  });

  it('Form removes links', () => {
    cy.get('[data-cy="tray-size-selector"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="popupIframe"]', { timeout: 10000 })
      .should('be.visible')
      .its('0.contentDocument.body', { timeout: 10000 })
      .should('not.be.empty')
      .then(cy.wrap)
      .as('iframeBody');

    cy.get('@iframeBody')
      .find('.gin-secondary-toolbar.layout-container')
      .should('not.exist');

    cy.get('@iframeBody')
      .find('header', { timeout: 10000 })
      .should('have.css', 'top', '0px');

    cy.get('@iframeBody').find('.gin--vertical-toolbar').should('not.exist');

    cy.get('@iframeBody').find('#toolbar-administration').should('not.exist');

    cy.get('[data-cy="closePopup"]').click();
  });

  it('Form selects new tray size', () => {
    cy.get('[data-cy="tray-size-selector"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="popupIframe"]', { timeout: 10000 })
      .should('be.visible')
      .its('0.contentDocument.body', { timeout: 10000 })
      .should('not.be.empty')
      .then(cy.wrap)
      .as('iframeBody');

    cy.get('@iframeBody')
      .find('[id="edit-name-0-value"]', { timeout: 10000 })
      .should('be.visible') // Ensure the input field is visible
      .type('NewTraySize');

    cy.get('@iframeBody')
      .find('[id="edit-submit"]', { timeout: 10000 })
      .should('be.visible') // Ensure the submit button is visible
      .click();

    cy.get('[data-cy="tray-size-selector"]')
      .find('[data-cy="selector-input"]', { timeout: 10000 })
      .should('have.value', 'NewTraySize');
  });

  it('Form checks Url', () => {
    cy.get('[data-cy="tray-size-selector"]')
      .find('[data-cy="selector-add-button"]')
      .click();

    cy.get('[data-cy="popupIframe"]', { timeout: 10000 }).then(($iframe) => {
      $iframe.attr('src', 'http://farmos/fd2/tray_seeding');
    });

    cy.get('[data-cy="overlay"]').should('not.exist');
    cy.get('[data-cy="popup"]').should('not.exist');
    cy.get('[data-cy="closePopup"]').should('not.exist');
    cy.get('[data-cy="popupIframe"]').should('not.exist');
  });
});
