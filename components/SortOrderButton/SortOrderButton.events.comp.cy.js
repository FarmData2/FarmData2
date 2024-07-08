import SortOrderButton from '@comps/SortOrderButton/SortOrderButton.vue';

describe('Test the SortOrderButton component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "ready" when component has been created', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
  });

  it('Emits "sort" when sort order is toggled', () => {
    const sortSpy = cy.spy().as('sortSpy');

    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
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

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledTwice')
      .and('have.been.calledWith', {
        label: 'example',
        sortOrder: 'desc',
      });

    cy.get('[data-cy="sort-order-button"]').click();
    cy.get('@sortSpy')
      .should('have.been.calledThrice')
      .and('have.been.calledWith', {
        label: 'example',
        sortOrder: 'asc',
      });
  });

  it('Emits "sort" event with updated sort order when "sortOrder" prop is changed', () => {
    const sortSpy = cy.spy().as('sortSpy');

    cy.mount(SortOrderButton, {
      props: {
        label: 'example',
        sortOrder: 'asc',
        onSort: sortSpy,
      },
    }).then(({ wrapper }) => {
      wrapper.setProps({ sortOrder: 'desc' });
      cy.get('[data-cy="sort-order-button"]').click();
      cy.get('@sortSpy')
        .should('have.been.calledOnce')
        .and('have.been.calledWith', {
          label: 'example',
          sortOrder: 'asc',
        });
    });
  });
});
