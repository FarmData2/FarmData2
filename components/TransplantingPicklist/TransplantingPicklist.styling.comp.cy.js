import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

describe('Test the TransplantingPicklist component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check showValidityStyling does not appear crop selector when not required', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        required: false,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
        cy.get('[data-cy="selector-input"]').should(
          'have.not.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
      });
  });

  it('Check showValidityStyling appears on crop selector when invalid', () => {
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
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
      });
  });

  it('Check showValidityStyling on picklist table when invalid', () => {
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
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');

        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');

        cy.get('[data-cy="picklist-invalid-feedback"]').should('be.visible');
        cy.get('[data-cy="picklist-invalid-feedback"]').should(
          'have.text',
          'Select at least one tray to transplant.'
        );
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
      });
  });

  it('Check showValidityStyling on picklist table when valid', () => {
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
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');

        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');

        cy.get('[data-cy="picklist-quantity-0"]').select('1');

        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
      });
  });
});
