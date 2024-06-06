import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the default SelectorBase content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the data-cy elements exist', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-group"]').should('exist');
        cy.get('[data-cy="selector-label"]').should('have.text', 'TheLabel:');
        cy.get('[data-cy="selector-required"]').should('not.exist');
        cy.get('[data-cy="selector-input"]').should('exist');
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 6);
        cy.get('[data-cy="selector-option-0"]').should('have.value', '');
        cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
        cy.get('[data-cy="selector-option-5"]').should('have.value', 'Five');
        cy.get('[data-cy="selector-add-button"]').should('not.exist');
        cy.get('[data-cy="selector-delete-button"]').should('not.exist');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'Invalid feedback text.'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('Test required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-group"]').should('exist');
        cy.get('[data-cy="selector-label"]').should('have.text', 'TheLabel:');
        cy.get('[data-cy="selector-required"]').should('exist');
        cy.get('[data-cy="selector-input"]').should('exist');
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 6);
        cy.get('[data-cy="selector-option-0"]').should('have.value', '');
        cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
        cy.get('[data-cy="selector-option-5"]').should('have.value', 'Five');
        cy.get('[data-cy="selector-add-button"]').should('not.exist');
        cy.get('[data-cy="selector-delete-button"]').should('not.exist');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'Invalid feedback text.'
        );
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'not.be.visible'
        );
      });
  });

  it('Test selected prop and delete button when required', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'Three',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.value', 'Three');
        cy.get('[data-cy="selector-delete-button"]').should('not.exist');
      });
  });

  it('Test selected prop and delete button when not required', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'Three',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.value', 'Three');
        cy.get('[data-cy="selector-delete-button"]').should('exist');
      });
  });

  it('Test includeAddButton prop', () => {
    const readySpy = cy.spy().as('readySpy');
    const addClickedSpy = cy.spy().as('addClickedSpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        addOptionUrl: 'add/option/url',
        onReady: readySpy,
        onAddClicked: addClickedSpy,
        includeAddButton: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
        cy.get('[data-cy="selector-add-button"]').click();
        cy.get('@addClickedSpy').should('have.been.calledOnce');
      });
  });

  it('Test showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
      });
  });
});
