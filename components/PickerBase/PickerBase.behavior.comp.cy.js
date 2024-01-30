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
});
