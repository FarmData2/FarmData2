import SortOrderButton from '@comps/SortOrderButton/SortOrderButton.vue';

describe('Test the default SortOrderButton content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the default data-cy elements and default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'example',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="sort-order-button-group"]').should('exist');
        cy.get('[data-cy="sort-order-button"]').should('exist');
        cy.get('[data-cy="sort-order-text"]').should('have.text', 'Sort By');
        cy.get('[data-cy="sort-order-icon"]').should('exist');
        cy.get('[data-cy="sort-order-button"]').should(
          'not.have.class',
          'sorted'
        );
        cy.get('[data-cy="sort-order-icon"] svg').should('exist');
      });
  });

  it('Test that props are passed and reflected in the component', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'example',
        isActive: true,
        sortOrder: 'asc',
        label: 'Sort Ascending',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="sort-order-button"]').should('have.class', 'sorted');
        cy.get('[data-cy="sort-order-text"]').should(
          'have.text',
          'Sort Ascending'
        );
        cy.get('[data-cy="sort-order-icon"]').should('have.text', '↓');
      });
  });
});
