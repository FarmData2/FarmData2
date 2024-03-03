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
   * required   showValidityStyling    isValid   Tested by Test
   * false      false                  false     5. Not required, Not showing, not valid
   * false      false                  true      6. Not required, Not showing, valid
   * false      true                   false     7. Not required, Showing, not valid
   * false      true                   true      8. Not required, Showing, valid
   * true       false                  false     5. Not required, Not showing, not valid
   * true       false                  true      6. Not required, Not showing, valid
   * true       true                   false     7. Not required, Showing, not valid
   * true       true                   true      8. Not required, Showing, valid
   */

  it('1. Not required, Not showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: false,
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

  it('2. Not required, Not showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: false,
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

  it('3. Not required, Showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: false,
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
          .should('not.have.class', 'is-invalid');
        cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');
      });
  });

  it('4. Not required, Showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PickerBase, {
      props: {
        required: false,
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

  it('5. Required, Not showing, not valid', () => {
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

  it('6. Required, Not showing, valid', () => {
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

  it('7. Required, Showing, not valid', () => {
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

  it('8. Required, Showing, valid', () => {
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
