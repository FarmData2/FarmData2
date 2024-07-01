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
        })
        .then(() => {
          /*
           * Without extra then here, the wrapper.setProps usually executes before
           * the cy.get() above, causing the test to fail.
           */
          wrapper.setProps({ selected: ['one', 'two'] });
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'one');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'two');
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
});
