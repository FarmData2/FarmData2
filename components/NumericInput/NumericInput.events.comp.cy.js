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

  /* 
    Initial value Prop Tests

    1.a value < minValue - emits update:value with minValue and valid with true
    1.b value > maxValue - emits update:value with maxValue and valid with true
    1.c value is invalid (e.g. abc) - emits update:value with NaN and valid with false
    1.d. value is valid (e.g. 7) - emits update:value with new value and valid with true
    1.e required is false, value is invalid (e.g. abc) - emits update:value with NaN and valid with true

    value prop change tests

    2.a value changes from valid (e.g. 7) to valid (e.g. 8), emits update:value with new value, but does not emit valid
    2.b value changes from valid to invalid (e.g. abc), emits update:value with NaN and valid with false
    2.c value changes from invalid (e.g. abc) to invalid (def), does not emit update:value or valid
    2.d value changes from invalid to valid, emits update:value with new value and valid with true
    2.e value changes from valid to < minValue, emits update:value with minValue, but does not emit valid
    2.f value changes from valid to > maxValue, emits update:value with maxValue, but does not emit valid
    2g value changes from invalid to < minValue, emits update:value with minValue and valid with true
    2h value changes from invalid to > maxValue, emits update:value with maxValue and valid with false 
    2.i maxValue changes (100 -> 10) to exclude value (50), emits update:value with maxValue and valid with true
    2.j minValue changes (-50 -> 0) to exclude value (-10), emits update:value with minValue and valid with true
  */

  it('1a. initial value < minValue emits minValue and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: -6,
        minValue: 0,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 0);

        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('1b. initial value > maxValue emits maxValue and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 102,
        maxValue: 100,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 100);

        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('1c. initial value is string, emits NaN and invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 'abc',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', NaN);

        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('1d. initial value is number, emits number and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 7);

        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('1e. required is false initial value is string, emits NaN and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: false,
        value: 'abc',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', NaN);

        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('2a. value prop changes from valid to valid, emits new value, does not emit valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: 20 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 20);

            //called only once for initial prop set
            cy.get('@validSpy').should('have.been.calledOnce');
          });
        });
    });
  });

  it('2b. value prop changes from valid to invalid, emits NaN and invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: 'abc' }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', NaN);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', false);
          });
        });
    });
  });

  it('2c. value prop changes from invalid to invalid, emits NaN and invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 'abc',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: 'def' }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', NaN);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', false);
          });
        });
    });
  });

  it('2d. value prop changes from invalid to valid, emits value and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 'abc',
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: 7 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 7);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', true);
          });
        });
    });
  });

  it('2e. value prop changes from valid to < minValue, emits minValue, does not emit valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        minValue: 0,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: -2 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 0);

            //called only once for initial prop set
            cy.get('@validSpy').should('have.been.calledOnce');
          });
        });
    });
  });

  it('2f. value prop changes from valid to > maxValue, emits maxValue, does not emit valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        maxValue: 10,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: 12 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 10);

            //called only once for initial prop set
            cy.get('@validSpy').should('have.been.calledOnce');
          });
        });
    });
  });

  it('2g. value prop changes from invalid to < minValue, emits minValue and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 'abc',
        minValue: 0,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: -5 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 0);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', true);
          });
        });
    });
  });

  it('2h. value prop changes from invalid to > maxValue, emits maxValue and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 'abc',
        maxValue: 100,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ value: 102 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 100);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', true);
          });
        });
    });
  });

  it('2i. maxValue changes to < value, emits maxValue and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 100,
        maxValue: 1000,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ maxValue: 90 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 90);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', true);
          });
        });
    });
  });

  it('2j. minValue changes to > value, emits minValue and valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(NumericInput, {
      props: {
        required: true,
        value: 7,
        minValue: 0,
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        onReady: readySpy,
        onValid: validSpy,
        'onUpdate:value': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ minValue: 10 }).then(() => {
            cy.get('@updateSpy').should('have.been.called');
            cy.get('@updateSpy').should('have.been.calledWith', 10);

            cy.get('@validSpy').should('have.been.called');
            cy.get('@validSpy').should('have.been.calledWith', true);
          });
        });
    });
  });
});
