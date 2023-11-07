import %COMPONENT_NAME% from '@comps/%COMPONENT_NAME%/%COMPONENT_NAME%.vue';

describe('Test the  DateSelect component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });
  
  it('Emits "ready" when component has been created', () => {
    /*
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    const readySpy = cy.spy().as('readySpy');

    cy.mount(%COMPONENT_NAME%, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce').then(() => {
      cy.get('[data-cy="new-comp-group"]').should('exist');
      cy.get('[data-cy="placeholder"]').should(
        'have.text',
        'Component content goes here.'
      );
    });
  });
});
