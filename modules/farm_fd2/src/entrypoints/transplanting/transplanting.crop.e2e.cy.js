describe('Transplanting: Crop Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/transplanting/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Crop exists, is visible, is enabled, no trays button is visible, and picklist table is empty', () => {
    cy.get('[data-cy="transplanting-picklist"]').should('exist');
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .should('be.visible')
      .should('be.enabled');
    cy.get('[data-cy="picklist-units-button"]').should('not.exist');
    cy.get('[data-cy="picklist-table"]').find('tr').should('have.length', 1);
  });

  it('Check correct log of a selected crop', () => {
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .select('BROCCOLI');
    cy.get('[data-cy="picklist-table"]').find('tr').should('have.length', 6);
    cy.get('[data-cy="picklist-units-button"]').should('exist').click();
    // first row
    cy.get(`[data-cy="picklist-quantity-0"]`).should('have.value', 4);
    cy.get(`[data-cy="picklist-date-0"]`).should('have.text', '2019-03-11');
    cy.get(`[data-cy="picklist-location-0"]`).should('have.text', 'CHUAU');
    cy.get('[data-cy="picklist-info-icon-0"]')
      .should('exist')
      .click({ force: true });
    cy.get('[data-cy="picklist-info-overlay"]').should('be.visible');
    cy.get('[data-cy="picklist-info-user-0"]').should(
      'have.text',
      'User: admin'
    );
    cy.get('[data-cy="picklist-info-tray-size-0"]').should(
      'have.text',
      'Tray Size: 128'
    );
    cy.get('[data-cy="picklist-info-seeds/cell-0"]').should(
      'have.text',
      'Seeds/Cell: 1'
    );
    cy.get('[data-cy="picklist-info-total-seeds-0"]').should(
      'have.text',
      'Total Seeds: 512'
    );
    cy.get('[data-cy="picklist-info-notes-0"]').should(
      'have.text',
      'Notes: First broccoli tray seeding.'
    );

    // last row
    cy.get(`[data-cy="picklist-quantity-4"]`).should('have.value', 2);
    cy.get(`[data-cy="picklist-date-4"]`).should('have.text', '2019-07-26');
    cy.get(`[data-cy="picklist-location-4"]`).should('have.text', 'JASMINE');
    cy.get('[data-cy="picklist-info-icon-4"]')
      .should('exist')
      .click({ force: true });
    cy.get('[data-cy="picklist-info-overlay"]').should('be.visible');
    cy.get('[data-cy="picklist-info-user-4"]').should(
      'have.text',
      'User: admin'
    );
    cy.get('[data-cy="picklist-info-tray-size-4"]').should(
      'have.text',
      'Tray Size: 288'
    );
    cy.get('[data-cy="picklist-info-seeds/cell-4"]').should(
      'have.text',
      'Seeds/Cell: 1'
    );
    cy.get('[data-cy="picklist-info-total-seeds-4"]').should(
      'have.text',
      'Total Seeds: 576'
    );
    cy.get('[data-cy="picklist-info-notes-4"]').should(
      'have.text',
      'Notes: Last broccoli tray seeding.'
    );
  });

  it('Crop props are correct', () => {
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-required"]')
      .should('be.visible');
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .should('have.value', null);
  });

  it('Crop validity styling works when no crop is selected', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-invalid');
  });

  it('Tray validity styling works when crop is selected, and no tray is selected', () => {
    cy.get('[data-cy="transplanting-picklist"]')
      .find('[data-cy="selector-input"]')
      .select('BROCCOLI');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="picklist-table"]').should('have.class', 'is-invalid');
  });
});
