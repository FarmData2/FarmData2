describe('Direct Seeding: Equipment Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/direct_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Equipment accordion exists, is visible, is collapsed', () => {
    cy.get('[data-cy="direct-seeding-equipment-accordion"]').should(
      'be.visible'
    );
    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]')
      .should('be.visible')
      .should('contain.text', 'Equipment & Soil Disturbance');
    cy.get('[data-cy="direct-seeding-equipment-accordion-item"]').should(
      'not.be.visible'
    );
  });

  it('Equipment accordion expands', () => {
    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]').click();
    cy.get('[data-cy="direct-seeding-equipment-accordion-item"]').should(
      'be.visible'
    );
    cy.get('[data-cy="direct-seeding-equipment-selector"]').should(
      'be.visible'
    );
  });

  it('Depth and Speed appear when equipment is added', () => {
    cy.get('[data-cy="direct-seeding-soil-disturbance-depth"]').should(
      'not.be.visible'
    );
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]').should(
      'not.be.visible'
    );
    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]').click();
    cy.get('[data-cy="direct-seeding-equipment-selector"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="direct-seeding-soil-disturbance-depth"]').should(
      'be.visible'
    );
    cy.get('[data-cy="direct-seeding-soil-disturbance-speed"]').should(
      'be.visible'
    );
  });

  it('Equipment validity styling not shown when equipment not selected', () => {
    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="direct-seeding-equipment-selector"]')
      .find('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('not.have.class', 'is-valid')
      .should('not.have.class', 'is-invalid');
  });

  it('Equipment validity styling shown when equipment selected', () => {
    cy.get('[data-cy="direct-seeding-equipment-accordion-title"]').click();
    cy.get('[data-cy="direct-seeding-equipment-selector"]')
      .find('[data-cy="selector-input"]')
      .select('Tractor');
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="direct-seeding-equipment-selector"]')
      .find('[data-cy="equipment-selector-1"]')
      .find('[data-cy="selector-input"]')
      .should('have.class', 'is-valid');
  });
});
