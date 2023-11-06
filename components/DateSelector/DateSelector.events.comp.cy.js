import DateSelector from '@comps/DateSelector/DateSelector.vue';

describe('Test the  DateSelector component events', () => {
  it('Emits "ready" when component has been created', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="date-group"]').should('exist');
  });

  it('Verify that `date` prop is watched', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(DateSelector, {
      props: {
        onReady: readySpy,
        'onUpdate:date': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ date: '1999-01-02' });
          cy.get('@updateSpy').should('have.been.calledOnce');
          cy.get('[data-cy="date-input"]').should('have.value', '1999-01-02');
        });
    });
  });

  it('Emits "update:date" when date is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(DateSelector, {
      props: {
        onReady: readySpy,
        'onUpdate:date': updateSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="date-input"]').type('1999-01-02');
          cy.get('@updateSpy').should('have.been.calledOnce');
          cy.get('@updateSpy').should('have.been.calledWith', '1999-01-02');
        });
    });
  });
});
