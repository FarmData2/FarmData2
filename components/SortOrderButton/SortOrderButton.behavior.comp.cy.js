import SortOrderButton from '@comps/SortOrderButton/SortOrderButton.vue';

describe('Test the SortOrderButton component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Component reacts to changed sortOrder prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
        sortOrder: 'asc',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');

          wrapper.setProps({ sortOrder: 'desc' });

          cy.get('[data-cy="sort-order-icon"]').should('have.text', '↑');
        });
    });
  });

  it('Component toggles sortOrder when button is clicked', () => {
    const sortSpy = cy.spy().as('sortSpy');

    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
        sortOrder: 'none',
        onSort: sortSpy,
      },
    });

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', {
        label: 'example',
        sortOrder: 'asc',
      });
    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledTwice')
      .and('have.been.calledWith', {
        label: 'example',
        sortOrder: 'desc',
      });
    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↑');

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledThrice')
      .and('have.been.calledWith', {
        label: 'example',
        sortOrder: 'asc',
      });
    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');
  });
});
