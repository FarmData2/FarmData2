import SortOrderButton from '@comps/SortOrderButton/SortOrderButton.vue';

describe('Test the SortOrderButton component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check initial styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'test',
        sortOrder: 'none',
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy').should('have.been.calledOnce');
      cy.get('[data-cy="sort-order-button"]').should('have.class', 'btn');
      cy.get('[data-cy="sort-order-button"]').should('have.class', 'btn-md');
      cy.get('[data-cy="sort-order-button"]').should('have.class', 'btn-block');
      cy.get('[data-cy="sort-order-button"]').should('have.class', 'rounded-0');
      cy.get('[data-cy="sort-order-button"]').should(
        'not.have.class',
        'sorted'
      );
      cy.get('[data-cy="sort-order-text"]').should(
        'have.css',
        'color',
        'rgb(34, 35, 48)'
      );
      cy.get('[data-cy="sort-order-icon"]').should(
        'have.css',
        'color',
        'rgb(108, 117, 125)'
      );
      cy.get('[data-cy="sort-order-icon"]').should(
        'have.css',
        'opacity',
        '0.5'
      );
      cy.get('[data-cy="sort-order-icon"]').find('svg').should('exist');
    });
  });

  it('Check active sort order styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'test',
        sortOrder: 'asc',
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy').should('have.been.calledOnce');

      cy.get('[data-cy="sort-order-button"]').should('have.class', 'sorted');
      cy.get('[data-cy="sort-order-text"]').should(
        'have.css',
        'color',
        'rgb(25, 135, 84)'
      );
      cy.get('[data-cy="sort-order-icon"]').should('have.css', 'opacity', '1');
      cy.get('[data-cy="sort-order-icon"]').find('svg').should('not.exist');
      cy.get('[data-cy="sort-order-icon"]').contains('↓').should('exist');
    });
  });

  it('Check sort order toggle behavior and styling', () => {
    const sortSpy = cy.spy().as('sortSpy');

    cy.mount(SortOrderButton, {
      props: {
        identifier: 'test',
        sortOrder: 'none',
        onSort: sortSpy,
      },
    });

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('[data-cy="sort-order-button"]').then(() => {
      cy.get('@sortSpy').should('have.been.calledWith', {
        identifier: 'test',
        sortOrder: 'asc',
      });

      cy.get('[data-cy="sort-order-button"]').should('have.class', 'sorted');
      cy.get('[data-cy="sort-order-icon"]').should('have.css', 'opacity', '1');
      cy.get('[data-cy="sort-order-icon"]').find('svg').should('not.exist');
      cy.get('[data-cy="sort-order-icon"]').contains('↓').should('exist');
    });

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('[data-cy="sort-order-button"]').then(() => {
      cy.get('@sortSpy').should('have.been.calledWith', {
        identifier: 'test',
        sortOrder: 'desc',
      });

      cy.get('[data-cy="sort-order-button"]').should('have.class', 'sorted');
      cy.get('[data-cy="sort-order-icon"]').should('have.css', 'opacity', '1');
      cy.get('[data-cy="sort-order-icon"]').find('svg').should('not.exist');
      cy.get('[data-cy="sort-order-icon"]').contains('↑').should('exist');
    });

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('[data-cy="sort-order-button"]').then(() => {
      cy.get('@sortSpy').should('have.been.calledWith', {
        identifier: 'test',
        sortOrder: 'asc',
      });

      cy.get('[data-cy="sort-order-button"]').should('have.class', 'sorted');
      cy.get('[data-cy="sort-order-icon"]').should('have.css', 'opacity', '1');
      cy.get('[data-cy="sort-order-icon"]').find('svg').should('not.exist');
      cy.get('[data-cy="sort-order-icon"]').contains('↓').should('exist');
    });
  });
});
