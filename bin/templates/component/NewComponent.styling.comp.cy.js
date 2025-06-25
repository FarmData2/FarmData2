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

  it('Test the default component styling', () => {
    /*
     * Replace or remove this test and add other tests as necessary to fully
     * test the component's styling.
     * 
     * See the Components Guide (`docs/contributing/components.md` for more 
     * information about component testing. Also, see other components in 
     * the `components/` directory for examples.
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
