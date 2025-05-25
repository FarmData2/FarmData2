import MultiSelectorBase from '@comps/MultiSelectorBase/MultiSelectorBase.vue';

describe('Test the MultiSelectorBase component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check selected prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        selected: ['one'],
        options: ['one', 'two', 'three', 'four', 'five'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'one');

          wrapper.setProps({ selected: ['two', 'three'] });
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'two');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'three');
        });
    });
  });

  it('Making selections adds another selector', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one', 'two', 'three', 'four', 'five'],
        popupUrl: 'nonEmptyUrl',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-2"]').should('not.exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('one');

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('not.exist');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('exist');

        cy.get('[data-cy="selector-2"]').should('exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
      });
  });

  it('Delete button can remove first selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        selected: ['one', 'two', 'three'],
        options: ['one', 'two', 'three', 'four', 'five'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'one');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'two');
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'three');
        cy.get('[data-cy="selector-4"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'two');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'three');
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="selector-4"]').should('not.exist');
      });
  });

  it('Delete button can remove last selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        selected: ['one', 'two', 'three'],
        options: ['one', 'two', 'three', 'four', 'five'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'one');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'two');
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="selector-4"]').should('not.exist');
      });
  });

  it('Delete button can remove a middle selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        selected: ['one', 'two', 'three'],
        options: ['one', 'two', 'three', 'four', 'five'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'one');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'three');
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="selector-4"]').should('not.exist');
      });
  });

  it('Check appropriate items appear disabled when updating selected', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one', 'two', 'three'],
        selected: ['one', 'three'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-option-1"]')
            .should('not.be.disabled');
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-option-2"]')
            .should('not.be.disabled');
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-option-3"]')
            .should('be.disabled');

          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-option-1"]')
            .should('be.disabled');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-option-2"]')
            .should('not.be.disabled');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-option-3"]')
            .should('not.be.disabled');

          cy.get('[data-cy="selector-3"]')
            .find('[data-cy="selector-option-1"]')
            .should('be.disabled');
          cy.get('[data-cy="selector-3"]')
            .find('[data-cy="selector-option-2"]')
            .should('not.be.disabled');
          cy.get('[data-cy="selector-3"]')
            .find('[data-cy="selector-option-3"]')
            .should('be.disabled');
        });

      wrapper.setProps({ selected: ['two', 'three'] });

      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-2"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-3"]')
        .should('be.disabled');

      cy.get('[data-cy="selector-2"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-2"]')
        .find('[data-cy="selector-option-2"]')
        .should('be.disabled');
      cy.get('[data-cy="selector-2"]')
        .find('[data-cy="selector-option-3"]')
        .should('not.be.disabled');

      cy.get('[data-cy="selector-3"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-3"]')
        .find('[data-cy="selector-option-2"]')
        .should('be.disabled');
      cy.get('[data-cy="selector-3"]')
        .find('[data-cy="selector-option-3"]')
        .should('be.disabled');
    });
  });

  it('Check display correct disabled status when new item selected.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one', 'two', 'three'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('one');

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-3"]')
          .should('not.be.disabled');

        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-1"]')
          .should('be.disabled');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-3"]')
          .should('not.be.disabled');
      });
  });

  it('Check display correct disabled status when deleted.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one', 'two', 'three'],
        selected: ['one', 'three'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-3"]')
          .should('not.be.disabled');

        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-3"]')
          .should('be.disabled');
      });
  });

  it('Check appropriate items appear disabled when updating options', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one', 'two'],
        selected: ['one'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-option-1"]')
            .should('not.be.disabled');
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-option-2"]')
            .should('not.be.disabled');

          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-option-1"]')
            .should('be.disabled');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-option-2"]')
            .should('not.be.disabled');
        });

      wrapper.setProps({ options: ['two', 'three'] });

      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-2"]')
        .should('not.be.disabled');
    });
  });

  it('allowDuplicateSelections allows users to select multiple items', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one', 'two'],
        allowDuplicateSelections: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('one');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .select('one');

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');

        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');

        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-option-2"]')
          .should('not.be.disabled');
      });
  });

  it('Turning allowDuplicateSelections off removes all duplicates', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        options: ['one'],
        selected: ['one', 'one'],
        allowDuplicateSelections: true,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy').should('have.been.calledOnce');

      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-2"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-3"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');

      wrapper.setProps({ allowDuplicateSelections: false });

      cy.get('[data-cy="selector-1"]')
        .find('[data-cy="selector-option-1"]')
        .should('not.be.disabled');
      cy.get('[data-cy="selector-2"]')
        .find('[data-cy="selector-option-1"]')
        .should('be.disabled');
      cy.get('[data-cy="selector-3"]').should('not.exist');
    });
  });

  it('Check display correct disabled status when all selections are deleted.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiSelectorBase, {
      props: {
        onReady: readySpy,
        required: false,
        options: ['one'],
        selected: ['one'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-option-1"]')
          .should('not.be.disabled');
      });
  });
});
