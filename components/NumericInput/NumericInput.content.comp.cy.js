import NumericInput from '@comps/NumericInput/NumericInput.vue';

describe('Test the default NumericInput content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the default data-cy elements', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-group"]').should('exist');
        cy.get('[data-cy="numeric-input"]').should('have.value', '7');
        cy.get('[data-cy="numeric-label"]').should('have.text', 'Test:');
        cy.get('[data-cy="numeric-required"]').should('not.exist');
        cy.get('[data-cy="numeric-decrease-sm"]').should('not.exist');
        cy.get('[data-cy="numeric-decrease-md"]').should('not.exist');
        cy.get('[data-cy="numeric-decrease-lg"]').should('not.exist');
        cy.get('[data-cy="numeric-increase-sm"]').should('not.exist');
        cy.get('[data-cy="numeric-increase-md"]').should('not.exist');
        cy.get('[data-cy="numeric-increase-lg"]').should('not.exist');
        cy.get('[data-cy="numeric-invalid-feedback"]').should(
          'have.text',
          'Test feedback text'
        );
        cy.get('[data-cy="numeric-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('Test required is set', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        required: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-required"]').should('be.visible');
        cy.get('[data-cy="numeric-required"]').should('have.text', '*');
      });
  });

  it('Test showValidityStyling bound', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 'abc',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-invalid-feedback"]').should('be.visible');
        cy.get('[data-cy="numeric-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="numeric-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="numeric-invalid-feedback"]').should('be.visible');
      });
  });

  it('Test initial value is formatted', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7.234567,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should('have.value', '7');
      });
  });

  it('Test decimalPlaces is used', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        decimalPlaces: 3,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7.234567,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should('have.value', '7.235');
      });
  });

  it('One incDecValue adds one button', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        incDecValues: [1],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.visible');
        cy.get('[data-cy="numeric-decrease-md"]').should('not.exist');
        cy.get('[data-cy="numeric-decrease-lg"]').should('not.exist');
        cy.get('[data-cy="numeric-increase-sm"]').should('be.visible');
        cy.get('[data-cy="numeric-increase-md"]').should('not.exist');
        cy.get('[data-cy="numeric-increase-lg"]').should('not.exist');
      });
  });

  it('Two incDecValues adds two buttons', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        incDecValues: [1, 5],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.visible');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.visible');
        cy.get('[data-cy="numeric-decrease-lg"]').should('not.exist');
        cy.get('[data-cy="numeric-increase-sm"]').should('be.visible');
        cy.get('[data-cy="numeric-increase-md"]').should('be.visible');
        cy.get('[data-cy="numeric-increase-lg"]').should('not.exist');
      });
  });

  it('Three incDecValue adds three buttons', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        incDecValues: [1, 5, 20],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.visible');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.visible');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.visible');
        cy.get('[data-cy="numeric-increase-sm"]').should('be.visible');
        cy.get('[data-cy="numeric-increase-md"]').should('be.visible');
        cy.get('[data-cy="numeric-increase-lg"]').should('be.visible');
      });
  });

  it('Initial value less than minValue', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        minValue: 10,
        value: 7,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should('have.value', '10');
      });
  });

  it('Initial value greater than maxValue', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        maxValue: 5,
        value: 7,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').should('have.value', '5');
      });
  });
});
