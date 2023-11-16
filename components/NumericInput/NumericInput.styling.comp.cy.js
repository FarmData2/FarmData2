import NumericInput from '@comps/NumericInput/NumericInput.vue';

describe('Test the NumericInput styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   *These are the possibilities here...
   *
   * required    validValue   show styling      Test
   * false       false        false             1. Not required, invalid value, no styling
   * false       false        true              2. Not required, invalid value, showing styling
   * false       true         false             3. Not required, valid value, not showing styling
   *                                               3.a. Non-empty value.
   *                                               3.b. Empty value.
   * false       true         true              4. Not required,  valid value, showing styling
   *                                               4.a. Non-empty value.
   *                                               4.b. Empty value.
   * true        false        false             5. Required, invalid value, not showing styling
   *                                               5.a. Non-empty value.
   *                                               5.b. Empty value.
   * true        false        true              6. Required, invalid value, showing styling
   *                                               6.a. Non-empty value.
   *                                               6.b. Empty value.
   * true        true         false             7. Required, valid value, not showing styling
   * true        true         true              8. Required, valid value, showing styling
   */

  it('1. Not required, invalid value, no styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: false,
        value: 'abc',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('2.a. Not required, non-empty invalid value, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: false,
        value: 'abc',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="numeric-invalid-feedback"]').should('be.visible');
      });
  });

  it('3.a. Not required, non-empty valid value, not showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: false,
        value: 7,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('3.b. Not required, empty valid value, not showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: false,
        value: '',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('4.a. Not required, non-empty valid value, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: false,
        value: 7,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('4.b. Not required, empty valid value, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: false,
        value: '',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('5.a. Required, non-empty invalid value, not showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: true,
        value: 'abc',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('5.b. Required, empty invalid value, not showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: true,
        value: '',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('6.a. Required, non-empty invalid value, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: true,
        value: 'abc',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="numeric-invalid-feedback"]').should('be.visible');
      });
  });

  it('6.b. Required, empty invalid value, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: true,
        value: '',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="numeric-invalid-feedback"]').should('be.visible');
      });
  });

  it('7. Required, valid value, not showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: true,
        value: 7,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('8. Required, valid value, showing styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback',
        required: true,
        value: 7,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });
});
