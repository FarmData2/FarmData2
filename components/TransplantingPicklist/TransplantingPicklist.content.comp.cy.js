import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

describe('Test the default TransplantingPicklist content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check default content', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="transplanting-picklist-group"]').should('exist');

        cy.get('[data-cy="selector-label"]').should('have.text', 'Crop:');
        cy.get('[data-cy="selector-required"]').should('have.text', '*');
        cy.get('[data-cy="selector-input"]').should('have.value', null);

        cy.get('[data-cy="picklist-table"]').should('exist');
        cy.get('[data-cy="picklist-all-button"]').should('not.exist');
        cy.get('[data-cy="picklist-units-button"]').should('not.exist');
        cy.get('[data-cy="picklist-units-button"]').should('not.exist');
        cy.get('[data-cy="picklist-header-date"]').should('be.visible');
        cy.get('[data-cy="picklist-header-location"]').should('be.visible');

        cy.get('[data-cy="picklist-row-0"]').should('not.exist');
      });
  });

  it('Check required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        required: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-required"]').should('not.exist');
      });
  });

  it('Check showValidityStyling prop crop selector', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-invalid-feedback"]').should('be.visible');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'have.text',
          'A crop must be selected.'
        );
      });
  });

  it('Check Crop names are fetched', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 9);
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'BROCCOLI');
        cy.get('[data-cy="selector-option-8"]').should('have.text', 'ZUCCHINI');
      });
  });
});
