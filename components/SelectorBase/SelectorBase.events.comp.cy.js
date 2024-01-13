import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the SelectorBase component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" with true on creation', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        required: true,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'One',
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "valid" with false on creation', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        required: true,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: '',
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "update:selected" when selection is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('Two');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'Two');
      });
  });

  it('Emits "valid" when a valid option is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledWith', false); // during creation.
        cy.get('[data-cy="selector-input"]').select('Two');
        cy.get('@validSpy').should('have.been.calledTwice'); // on creation and on selection.
        cy.get('@validSpy').should('have.been.calledWith', true); // during selection.
      });
  });

  it('Only emits "valid" when validity changes', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce'); // on creation.
        cy.get('[data-cy="selector-input"]').select('Two');
        cy.get('@validSpy').should('have.been.calledTwice'); // on selection.
        cy.get('[data-cy="selector-input"]').select('Three');
        cy.get('@validSpy').should('have.been.calledTwice'); // but not again - no change in validity.
        cy.get('[data-cy="selector-input"]').select('Four');
        cy.get('@validSpy').should('have.been.calledTwice');
      });
  });

  it('Emits "update:selected" when selection is cleared', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'Two',
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-delete-button"]').click();
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', '');
        cy.get('[data-cy="selector-input"]').should('have.value', null);
      });
  });
});
