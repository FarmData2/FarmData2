import MultiSelectorBase from '@comps/MultiSelectorBase/MultiSelectorBase.vue';

describe('Test the MultiSelectorBase component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" false on creation if required and no item is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        required: true,
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

  it('Emits "valid" true on creation if not required and no item is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(MultiSelectorBase, {
      props: {
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

  it('Emits "valid" true on creation if required and one item is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['one'],
        options: ['one', 'two', 'three'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // one call in created() and one due to change in isValid.
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "valid" true on creation if required and multiple items are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['one', 'two'],
        options: ['one', 'two', 'three'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits valid false when required and prop changed to contain no selections', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['one'],
        options: ['one', 'two', 'three'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@validSpy').should('have.been.calledOnce');
          cy.get('@validSpy').should('have.been.calledWith', true);
        })
        .then(() => {
          wrapper.setProps({ selected: [] });
          cy.get('@validSpy').should('have.been.calledTwice');
          cy.get('@validSpy').should('have.been.calledWith', false);
        });
    });
  });

  it('Emits valid true when not required and prop changed to contain no selections', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        required: false,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['one'],
        options: ['one', 'two', 'three'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@validSpy').should('have.been.calledOnce');
          cy.get('@validSpy').should('have.been.calledWith', true);
        })
        .then(() => {
          wrapper.setProps({ selected: [] });
          cy.get('@validSpy').should('have.been.calledWith', true);
        });
    });
  });

  it('Emits "update:selected" when first selection is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
        options: ['one', 'two', 'three'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('one');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', ['one']);
      });
  });

  it('Emits "update:selected" with array when second selection is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        selected: ['one'],
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
        options: ['one', 'two', 'three'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .select('two');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', ['one', 'two']);
      });
  });

  it('Emits "add-clicked" forwarded from SelectorBase with new option', () => {
    const readySpy = cy.spy().as('readySpy');
    const addSpy = cy.spy().as('addSpy');

    cy.mount(MultiSelectorBase, {
      props: {
        selected: ['one'],
        onReady: readySpy,
        'onAdd-clicked': addSpy,
        options: ['one', 'two', 'three'],
        popupUrl: '', // when mounting, set the popupUrl to '' to avoid errors when testing
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-add-button"]')
          .click();
        cy.get('[data-cy="selector-closePopup"]').click();
        cy.get('@addSpy').should('have.been.calledOnce');
        cy.get('@addSpy').should('have.been.with', null);
      });
  });
});
