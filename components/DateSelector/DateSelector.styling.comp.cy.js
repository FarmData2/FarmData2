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
   * There are 4 possibilities for styling...
   *
   * showValidityStyling    isValid   Tested by Test
   * false                  false     1. Not showing, not valid
   * false                  true      2. Not showing, valid
   * true                   false     3. Showing, not valid
   * true                   true      4. Showing, valid
   */

  it('1. Not showing, not valid', () => {
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

  it('2. Not showing, valid', () => {
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

  it('3. Showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: null,
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

  it('4. Showing, valid', () => {
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
