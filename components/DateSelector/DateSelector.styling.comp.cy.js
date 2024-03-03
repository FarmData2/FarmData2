import DateSelector from '@comps/DateSelector/DateSelector.vue';

describe('Test the DateSelector styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * There are 8 possibilities for styling...
   *
   * required   showValidityStyling    isValid   Tested by Test
   * false      false                  false     1. Not Required, Not showing, not valid
   * false      false                  true      2. Not Required, Not showing, valid
   * false      true                   false     3. Not Required, Showing, not valid
   * false      true                   true      4. Not Required, Showing, valid
   * true       false                  false     5. Required, Not showing, not valid
   * true       false                  true      6. Required, Not showing, valid
   * true       true                   false     7. Required, Showing, not valid
   * true       true                   true      8. Required, Showing, valid
   */

  it('1. Not Required, Not showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: false,
        date: null,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('2. Not Required, Not showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: false,
        date: '1999-01-02',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('3. Not Required, Showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: false,
        date: '',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('4. Not Required, Showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: false,
        date: '1999-01-02',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('5. Required, Not showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: null,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('6. Required, Not showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '1999-01-02',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('7. Required, Showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('be.visible');
      });
  });

  it('8. Required, Showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '1999-01-02',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
        cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
      });
  });
});
