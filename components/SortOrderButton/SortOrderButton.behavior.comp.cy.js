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
        identifier: 'example',
        sortOrder: 'asc',
        isActive: true,
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

  it('Component reacts to changed isActive prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'example',
        isActive: false,
        sortOrder: 'none',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="sort-order-button"]').should(
            'not.have.class',
            'sorted'
          );

          wrapper.setProps({ isActive: true, sortOrder: 'asc' });

          cy.get('[data-cy="sort-order-button"]').should(
            'have.class',
            'sorted'
          );
          cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');
        });
    });
  });

  it('Component toggles sortOrder when button is clicked', () => {
    const sortSpy = cy.spy().as('sortSpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'example',
        isActive: true,
        sortOrder: 'none',
        onSort: sortSpy,
      },
    });

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', {
        identifier: 'example',
        sortOrder: 'asc',
      });

    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledTwice')
      .and('have.been.calledWith', {
        identifier: 'example',
        sortOrder: 'desc',
      });

    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↑');
  });
});
