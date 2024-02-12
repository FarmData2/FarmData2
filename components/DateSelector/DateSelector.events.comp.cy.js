import DateSelector from '@comps/DateSelector/DateSelector.vue';

describe('Test the  DateSelector component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" on creation', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(DateSelector, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
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
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').type('1999-01-02');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', '1999-01-02');
      });
  });

  it('Emits "valid" when validity of date becomes false', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="date-input"]').clear();

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "valid" when validity of date becomes true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        date: 'invalid-date',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="date-input"]').type('1999-01-02');

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Only emits "valid" when validity of date changes', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');

        cy.get('[data-cy="date-input"]').type('1999-01-02');
        cy.get('[data-cy="date-input"]').type('1999-01-03');
        cy.get('[data-cy="date-input"]').type('1999-01-04');

        cy.get('@validSpy').should('have.been.calledOnce');
      });
  });
});
