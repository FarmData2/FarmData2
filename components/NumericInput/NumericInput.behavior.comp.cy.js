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

  it('Decrease buttons are disabled appropriately.', () => {
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

  it('Increase buttons are disabled appropriately.', () => {
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

  it('Increment button rounds up appropriately', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 5,
        incDecValues: [10],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '20');
      });
  });

  it('Increment button rounds down appropriately', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 3,
        incDecValues: [10],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '10');
      });
  });

  it('Decrement button rounds up appropriately', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 16,
        incDecValues: [10],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '10');
      });
  });

  it('Decrement button rounds down appropriately', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 13,
        incDecValues: [10],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '0');
      });
  });

  it('Typed input disables buttons as appropriate.', () => {
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

  it('Typed values remain within bounds when minValue/maxValue are non-negative.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 50,
        minValue: 0,
        maxValue: 100,
        incDecValues: [50, 100],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.enabled');
        cy.get('[data-cy="numeric-increase-sm"]').should('be.enabled');
        cy.get('[data-cy="numeric-increase-md"]').should('be.disabled');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('101');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('[data-cy="numeric-input"]').should('have.value', '100');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('-1');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('[data-cy="numeric-input"]').should('have.value', '0');
      });
  });

  it('Typed input remains within bounds when minValue/maxValue are negative.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: -150,
        minValue: -200,
        maxValue: -100,
        incDecValues: [50, 100],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.enabled');
        cy.get('[data-cy="numeric-increase-sm"]').should('be.enabled');
        cy.get('[data-cy="numeric-increase-md"]').should('be.disabled');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('-99');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('[data-cy="numeric-input"]').should('have.value', '-100');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').type('-201');
        cy.get('[data-cy="numeric-input"]').blur();
        cy.get('[data-cy="numeric-input"]').should('have.value', '-200');
      });
  });

  it('Buttons set value to increment amount when input is blank.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 0,
        minValue: -100,
        incDecValues: [10],
        onReady: readySpy,
        maxValue: 100,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-increase-sm"]').click();

        cy.get('[data-cy="numeric-input"]').should('have.value', '10');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-decrease-sm"]').click();

        cy.get('[data-cy="numeric-input"]').should('have.value', '-10');
      });
  });

  it('Buttons disabled as appropriate when input is blank.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 0,
        minValue: -10,
        incDecValues: [1, 10, 100],
        onReady: readySpy,
        maxValue: 10,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-increase-sm"]').should('be.enabled');
        cy.get('[data-cy="numeric-increase-md"]').should('be.enabled');
        cy.get('[data-cy="numeric-increase-lg"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-sm"]').should('be.enabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.enabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.disabled');
      });
  });

  it('Buttons set value to increment amount when not required and input is blank', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 0,
        minValue: -100,
        incDecValues: [10],
        onReady: readySpy,
        maxValue: 100,
        required: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-increase-sm"]').click();

        cy.get('[data-cy="numeric-input"]').should('have.value', '10');

        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-decrease-sm"]').click();

        cy.get('[data-cy="numeric-input"]').should('have.value', '-10');
      });
  });

  it('Decrement value buttons are disabled with 0 minValue and blank input', () => {
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
        cy.get('[data-cy="numeric-input"]').clear();
        cy.get('[data-cy="numeric-input"]').blur();

        cy.get('[data-cy="numeric-decrease-sm"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-md"]').should('be.disabled');
        cy.get('[data-cy="numeric-decrease-lg"]').should('be.disabled');
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

  it('Component handles non-numeric prop values.', () => {
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
        })
        .then(() => {
          wrapper.setProps({ value: 'xyz' });
          cy.get('[data-cy="numeric-input"]').should('have.value', '');
        });
    });
  });

  it('Component bounds prop changes to min/max values.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 50,
        minValue: 25,
        maxValue: 100,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="numeric-input"]').should('have.value', '50');
        })
        .then(() => {
          wrapper.setProps({ value: -100 });
          cy.get('[data-cy="numeric-input"]').should('have.value', '25');
        })
        .then(() => {
          wrapper.setProps({ value: 200 });
          cy.get('[data-cy="numeric-input"]').should('have.value', 100);
        });
    });
  });
});
