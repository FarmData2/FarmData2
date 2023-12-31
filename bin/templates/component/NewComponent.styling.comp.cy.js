import %COMPONENT_NAME% from '@comps/%COMPONENT_NAME%/%COMPONENT_NAME%.vue';

describe('Test the %COMPONENT_NAME% component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Add tests for styling here', () => {
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

    cy.get('@readySpy')
    .should('have.been.calledOnce')
    .then(() => {
      cy.get('[data-cy="placeholder"]').should(
        'not.have.class',
        'is-valid'
      );
      cy.get('[data-cy="placeholder"]').should(
        'not.have.class',
        'is-invalid'
      );
    });
  });
});
