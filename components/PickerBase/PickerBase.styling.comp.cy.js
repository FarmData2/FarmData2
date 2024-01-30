import PickerBase from '@comps/PickerBase/PickerBase.vue';

describe('Test the PickerBase component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * There are 8 possibilities for styling...
   *
   * Note: empty -> no options are checked.
   *
   * required    empty        showInvalidStyling  Tested by Test
   * false       false        false               1. Not required - not empty - not showing
   * false       false        true                2. Not required - not empty - showing
   * false       true         false               3. Not required - empty - not showing
   * false       true         true                4. Not required - empty - showing
   * true        false        false               5. Required - not empty - not showing
   * true        false        true                6. Required - not empty - showing
   * true        true         false               7. Required - empty - not showing
   * true        true         true                8. Required - empty - showing
   */

  it('1. Not required - not empty - not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: false,
        picked: ['Option 1'],
        showValidityStyling: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        /*
         * Just check the first option here.  The content test checked
         * that styling was applied to all options.  So if it is applied
         * to one it will be applied to the others.
         */
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('2. Not required - not empty - showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: false,
        picked: ['Option 1'],
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('3. Not required - empty - not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: false,
        picked: [],
        showValidityStyling: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('4. Not required - empty - showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: false,
        picked: [],
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('5. Required - not empty - not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: true,
        picked: ['Option 1'],
        showValidityStyling: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('6. Required - not empty - showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: true,
        picked: ['Option 1'],
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('7. Required - empty - not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: true,
        picked: [],
        showValidityStyling: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('8. Required - empty - showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        onReady: readySpy,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        required: true,
        picked: [],
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('not.have.class', 'is-valid');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('be.visible');
      });
  });
});
