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
   *There are 8 possibilities here...
   *
   * required    validDate    show styling  Test
   * false       false        false             1. Not required, invalid date, no styling
   * false       false        true              2. Not required, invalid date, showing styling
   * false       true         false             3. Not required, valid date, not showing styling
   * false       true         true              4. Not required,  valid date, showing styling
   * true        false        false             5. Required, invalid valid date, not showing styling
   * true        false        true              6. Required, invalid valid date, showing styling
   * true        true         false             7. Required, valid date, not showing styling
   * true        true         true              8. Required, valid date, showing styling
   */

  it('1. Not required, invalid date, no styling', () => {
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

  it('2. Not required, invalid date, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: false,
        date: null,
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

  it('3. Not required, valid date, not showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: false,
        date: '1999-01-02',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('4. Not required,  valid date, showing styling', () => {
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

  it('5. Required, invalid valid date, not showing styling', () => {
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

  it('6. Required, invalid valid date, showing styling', () => {
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

  it('7. Required, valid date, not showing styling', () => {
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

  it('8. Required, valid date, showing styling', () => {
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
