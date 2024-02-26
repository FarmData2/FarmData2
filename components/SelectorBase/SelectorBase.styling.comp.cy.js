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
   * There are 4 possibilities for styling...
   *
   * showValidityStyling    isValid   Tested by Test
   * false                  false     1. Not showing, not valid
   * false                  true      2. Not showing, valid
   * true                   false     3. Showing, not valid
   * true                   true      4. Showing, valid
   */

  it('1. Not showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        showValidityStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('2. Not showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        showValidityStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'One',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('3. Showing, not valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        showValidityStyling: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="selector-invalid-feedback"]').should('be.visible');
      });
  });

  it('4. Showing, valid', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        showValidityStyling: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'One',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });
});
