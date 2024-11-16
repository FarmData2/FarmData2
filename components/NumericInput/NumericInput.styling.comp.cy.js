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
   * required    non-blank    show styling      Test
   * false       false         false             1. Not required, blank value, not showing styling
   * false       false         true              2. Not required, blank value, showing styling
   * false       true          false             3. Not required, valid value, not showing styling
   * false       true          true              4. Not required, valid value, showing styling
   * true        false         false             5. Required, blank value, not showing styling
   * true        false         true              6. Required, blank value, showing styling
   * true        true          false             7. Required, valid value, not showing styling
   * true        true          true              8. Required, valid value, showing styling
   */

  it('1. Not required, blank value, not showing styling', () => {
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

  it('2. Not required, blank value, showing styling', () => {
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
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('3. Not required, non-empty valid value, not showing styling', () => {
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

  it('4. Not required, valid value, showing styling', () => {
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

  it('5. Required, blank value, not showing styling', () => {
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

  it('6. Required, blank value, showing styling', () => {
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
