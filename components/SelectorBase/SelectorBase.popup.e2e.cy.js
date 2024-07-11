describe('SelectorBase popup test', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('/fd2_examples/selector_base');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Form removes links', () => {
    cy.get('[data-cy="popup-url-button"]').click();
    cy.get('[data-cy="selector-add-button"]').click();

    cy.get('[data-cy="selector-popupIframe"]', { timeout: 10000 })
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

    cy.get('[data-cy="selector-closePopup"]').click();
  });

  it('Form checks Url', () => {
    cy.get('[data-cy="popup-url-button"]').click();
    cy.get('[data-cy="selector-add-button"]').click();

    cy.get('[data-cy="selector-popupIframe"]', { timeout: 10000 }).then(
      ($iframe) => {
        $iframe.attr('src', 'http://farmos/fd2/tray_seeding');
      }
    );

    cy.get('[data-cy="selector-overlay"]').should('not.exist');
    cy.get('[data-cy="selector-popup"]').should('not.exist');
    cy.get('[data-cy="selector-closePopup"]').should('not.exist');
    cy.get('[data-cy="selector-popupIframe"]').should('not.exist');
  });
});
