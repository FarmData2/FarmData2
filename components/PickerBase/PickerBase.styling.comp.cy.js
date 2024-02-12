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
   * There are 4 possibilities for styling...
   *
   * showValidityStyling    isValid   Tested by Test
   * false                  false     1. Not showing, not valid
   * false                  true      2. Not showing, valid
   * true                   false     3. Showing, not valid
   * true                   true      4. Showing, valid
   */

  it.only('1. Not showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: true,
        showValidityStyling: false,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        onReady: readySpy,
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

  it.only('2. Not showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: true,
        showValidityStyling: false,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1'],
        invalidFeedbackText: 'Invalid feedback text.',
        onReady: readySpy,
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

  it.only('3. Showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: true,
        showValidityStyling: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        invalidFeedbackText: 'Invalid feedback text.',
        onReady: readySpy,
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

  it.only('4. Showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: true,
        showValidityStyling: true,
        label: 'Picker',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        picked: ['Option 1'],
        invalidFeedbackText: 'Invalid feedback text.',
        onReady: readySpy,
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
});
