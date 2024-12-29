import PickerBase from '@comps/PickerBase/PickerBase.vue';

describe('Test the PickerBase component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check options property updates when the array reference changes', () => {
    const initOpts = ['Option 1', 'Option 2', 'Option 3'];
    const newOpts = ['Option A', 'Option B', 'Option C', 'Option D'];

    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: initOpts,
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="picker-options"]')
            .children()
            .eq(0)
            .should('have.text', 'Option 1');

          wrapper.setProps({ options: newOpts });

          cy.get('[data-cy="picker-options"]')
            .children()
            .eq(0)
            .should('have.text', 'Option A');
          cy.get('[data-cy="picker-options"]')
            .children()
            .eq(3)
            .should('have.text', 'Option D');
        });
    });
  });

  it('Check picked prop changes picker options', () => {
    const readySpy = cy.spy().as('readySpy');

    let initPicked = ['Option 1', 'Option 3'];
    let newPicked = ['Option 2'];

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: initPicked,
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(1)
            .should('not.be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(2)
            .should('be.checked');

          wrapper.setProps({ picked: newPicked });

          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('not.be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(1)
            .should('be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(2)
            .should('not.be.checked');
        });
    });
  });

  it('Check showValidityStyling prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('not.have.class', 'is-invalid');

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('have.class', 'is-invalid');
        });
    });
  });

  it('All button selects all beds if none selected', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .each((input) => {
            cy.wrap(input).should('be.checked');
          });
      });
  });

  it('All button selects all beds if some but not all selected', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 3'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .each((input) => {
            cy.wrap(input).should('be.checked');
          });
      });
  });

  it('All button clears all beds if all selected', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').click();
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .each((input) => {
            cy.wrap(input).should('not.be.checked');
          });
      });
  });

  it('Changing option adjusts picked options if necessary', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    const newOpts = ['Option 2', 'Option 4'];

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1', 'Option 2', 'Option 3'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ options: newOpts });
          cy.get('@updateSpy').should('have.been.calledOnce');
          cy.get('@updateSpy').should('have.been.calledWith', ['Option 2']);
        });
    });
  });

  it('All button text updates correctly when selecting all options individually', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').should(
          'contain.text',
          '✅ All'
        );

        cy.get('[data-cy="picker-options"]').find('input').eq(0).click();
        cy.get('[data-cy="picker-all-button"]').should(
          'contain.text',
          '✅ All'
        );

        cy.get('[data-cy="picker-options"]').find('input').eq(1).click();
        cy.get('[data-cy="picker-all-button"]').should(
          'contain.text',
          '🚫 All'
        );
      });
  });

  it('All button text updates correctly when deselecting options individually', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2'],
        picked: ['Option 1', 'Option 2'],
        invalidFeedbackText: 'Invalid feedback text.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-all-button"]').should(
          'contain.text',
          '🚫 All'
        );

        cy.get('[data-cy="picker-options"]').find('input').eq(0).click();
        cy.get('[data-cy="picker-all-button"]').should(
          'contain.text',
          '✅ All'
        );

        cy.get('[data-cy="picker-options"]').find('input').eq(1).click();
        cy.get('[data-cy="picker-all-button"]').should(
          'contain.text',
          '✅ All'
        );
      });
  });
});
