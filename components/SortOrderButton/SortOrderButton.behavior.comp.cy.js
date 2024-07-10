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
    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
        sortOrder: 'asc',
      },
    }).then(({ wrapper }) => {
      cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');
      wrapper.setProps({ sortOrder: 'desc' });
      cy.get('[data-cy="sort-order-icon"]').should('have.text', '↑');
    });
  });

  it('Component toggles sortOrder when button is clicked', () => {
    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
        sortOrder: 'none',
      },
    });
    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');
    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↑');
    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');
  });
});
