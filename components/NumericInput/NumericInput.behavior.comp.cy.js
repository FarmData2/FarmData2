import NumericInput from '@comps/NumericInput/NumericInput.vue';

describe('Test the NumericInput component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Test increase buttons', () => {
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
        cy.get('[data-cy="numeric-increase-lg"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '20');
        cy.get('[data-cy="numeric-increase-md"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '25');
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '26');
      });
  });

  it('Test decrease buttons', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 50,
        incDecValues: [1, 5, 20],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '49');
        cy.get('[data-cy="numeric-decrease-md"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '44');
        cy.get('[data-cy="numeric-decrease-lg"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '24');
      });
  });

  it('Test decrease buttons are disabled', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 0,
        incDecValues: [1, 10, 100],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.disabled');

        cy.get('[data-cy="numeric-increase-sm"]').click();

        cy.get('[data-cy="numeric-decrease-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.disabled');

        cy.get('[data-cy="numeric-increase-md"]').click();

        cy.get('[data-cy="numeric-decrease-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.disabled');

        cy.get('[data-cy="numeric-increase-lg"]').click();

        cy.get('[data-cy="numeric-decrease-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('not.be.disabled');
      });
  });

  it('Test increase buttons are disabled', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 1000,
        incDecValues: [1, 10, 100],
        onReady: readySpy,
        maxValue: 1000,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').should('be.disabled');
        cy.get('[data-cy="numeric-increase-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('be.disabled');

        cy.get('[data-cy="numeric-decrease-sm"]').click();

        cy.get('[data-cy="numeric-increase-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('be.disabled');

        cy.get('[data-cy="numeric-decrease-md"]').click();

        cy.get('[data-cy="numeric-increase-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-md"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('be.disabled');

        cy.get('[data-cy="numeric-decrease-lg"]').click();

        cy.get('[data-cy="numeric-increase-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-md"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('not.be.disabled');
      });
  });

  it('Input of value larger than initial value replaces initial value', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 10,
        incDecValues: [100],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '100');
      });
  });

  it('Input of value smaller than initial value adds to initial value', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 10,
        incDecValues: [1],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '11');
      });
  });

  it('Input of value smaller than initial decimal value adds to initial value', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 0.5,
        incDecValues: [1],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '1');
      });
  });

  it('User typed input disables buttons', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 0,
        incDecValues: [1, 10, 100],
        onReady: readySpy,
        maxValue: 100,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.disabled');
        cy.get('[data-cy="numeric-increase-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-md"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('not.be.disabled');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('100');
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-decrease-sm"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('not.be.disabled');
        cy.get('[data-cy="numeric-increase-sm"]').should('be.disabled');
        cy.get('[data-cy="numeric-increase-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('be.disabled');
      });
  });

  it('Component reacts to changed value prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 50,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="numeric-input"]').should('have.value', '50');

          wrapper.setProps({ value: 100 });

          cy.get('[data-cy="numeric-input"]').should('have.value', '100');
        });
    });
  });

  it('Check change to empty value.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 50,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="numeric-input"]').should('have.value', '50');
        })
        .then(() => {
          wrapper.setProps({ value: '' });
          cy.get('[data-cy="numeric-input"]').should('have.value', '');
        })
        .then(() => {
          wrapper.setProps({ value: NaN });
          cy.get('[data-cy="numeric-input"]').should('have.value', '');
        })
        .then(() => {
          wrapper.setProps({ value: null });
          cy.get('[data-cy="numeric-input"]').should('have.value', '');
        });
    });
  });
});
