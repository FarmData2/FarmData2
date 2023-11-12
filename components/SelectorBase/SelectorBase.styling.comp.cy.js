import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the styling of the SelectorBase component', () => {
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
    cy.mount(SelectorBase, {
      props: {
        required: false,
        selected: 'One',
        showValidityStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it('2. Not required - not empty - showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: false,
        selected: 'One',
        showValidityStyling: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it('3. Not required - empty - not showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: false,
        selected: '',
        showValidityStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it('4. Not required - empty - showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: false,
        selected: '',
        showValidityStyling: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it('5. Required - not empty - not showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: true,
        selected: 'One',
        showValidityStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it('6. Required - not empty - showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: true,
        selected: 'One',
        showValidityStyling: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it('Required - empty - not showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: true,
        selected: '',
        showValidityStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('not.be.visible');
  });

  it(' 8. Required - empty - showing', () => {
    cy.mount(SelectorBase, {
      props: {
        required: true,
        selected: '',
        showValidityStyling: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
      },
    });

    cy.get('[data-cy="selector-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
    cy.get('[data-cy="selector-invalid-feedback"]').should('be.visible');
  });
});
