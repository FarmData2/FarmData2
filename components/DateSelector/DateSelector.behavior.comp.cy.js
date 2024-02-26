import DateSelector from '@comps/DateSelector/DateSelector.vue';

describe('Test the DateSelector behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Component reacts to changed date prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        date: '1999-01-02',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="date-input"]').should('have.value', '1999-01-02');

          wrapper.setProps({ date: '1999-01-03' });

          cy.get('[data-cy="date-input"]').should('have.value', '1999-01-03');
        });
    });
  });

  it('Component reacts to changed showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: 'invalid-date',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
          cy.get('[data-cy="date-input"]').should(
            'not.have.class',
            'is-invalid'
          );

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
          cy.get('[data-cy="date-input"]').should('have.class', 'is-invalid');
        });
    });
  });
});
