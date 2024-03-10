import NumericInput from '@comps/NumericInput/NumericInput.vue';

describe('Test the NumericInput component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /**
   * Does 6 checks on validity computation
   *
   * required   empty     valid     test
   * false      false     false     1a. valid event: Not required, not empty, not valid
   * false      false     true      1b. valid event: Not required, not empty, valid
   * false      true                2.  valid event: Not required, empty
   * true       false     false     3a. valid event: Required, not empty not valid
   * true       false     true      3b. valid event: Required, not empty valid
   * true       true                4.  valid event: Required, empty
   */

  it('1a. valid event: Not required, not empty, not valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        required: false,
        value: 'abc',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('1b. valid event: Not required, not empty, valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        required: false,
        value: 7,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
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

  it('2.  valid event: Not required, empty', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        required: false,
        value: '',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
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

  it('3a. valid event: Required, not empty not valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 'abc',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('3b. valid event: Required, not empty valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
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

  it('4.  valid event: Required, empty', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: '',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "update:value" when value is changed to valid value', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 'abc',
        onReady: readySpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('7');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 7);
      });
  });

  it('Emits "update:value" when value is changed to invalid value', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        onReady: readySpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', NaN);

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('abc');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('@updateSpy').should('have.been.calledTwice');
        cy.get('@updateSpy').should('have.been.calledWith', NaN);
      });
  });

  it('Emits "valid" when value becomes invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('abc');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "valid" when value becomes valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 'abc',
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('7');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Does not emit "valid" when value but not validity changes', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('8');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('@validSpy').should('have.been.calledOnce');
      });
  });
});
