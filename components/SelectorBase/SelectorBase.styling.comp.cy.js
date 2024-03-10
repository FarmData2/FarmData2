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
   * required   showValidityStyling    empty     Tested by Test
   * false      false                  false     1. Not required, not showing, not empty
   * false      false                  true      2. Not required, not showing, empty
   * false      true                   false     3. Not required, showing, not empty
   * false      true                   true      4. Not required, showing, empty
   * true       false                  false     5. required, not showing, not empty
   * true       false                  true      6. required, not showing, empty
   * true       true                   false     7. required, showing, not empty
   * true       true                   true      8. required, showing, empty
   */

  it('1. Not required, not showing, not empty', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: false,
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

  it('2. Not required, not showing, empty', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: false,
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

  it('3. Not required, showing, not empty', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: false,
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

  it('4. Not required, showing, empty', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: false,
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
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('5. Required, not showing, not empty', () => {
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

  it('6. Required, not showing, empty', () => {
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

  it('7. Required, showing, not empty', () => {
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

  it('8. Required, showing, empty', () => {
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
