import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

describe('Test the LocationSelector component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Test that selected prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        selected: 'CHUAU',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should('have.value', 'CHUAU');
          wrapper.setProps({ selected: 'JASMINE' });
          cy.get('[data-cy="selector-input"]').should('have.value', 'JASMINE');
        });
    });
  });

  it('Test that showValidityStyling prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        required: true,
        includeGreenhouses: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-invalid'
          );
          cy.get('[data-cy="selector-invalid-feedback"]').should(
            'not.be.visible'
          );

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="selector-input"]').should(
            'have.class',
            'is-invalid'
          );
          cy.get('[data-cy="selector-invalid-feedback"]').should('be.visible');
        });
    });
  });
});
