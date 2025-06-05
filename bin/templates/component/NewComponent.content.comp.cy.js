import %COMPONENT_NAME% from '@comps/%COMPONENT_NAME%/%COMPONENT_NAME%.vue';

describe('Test the default %COMPONENT_NAME% content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the default data-cy elements', () => {
    /*
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
      /*
       * Replace this assertion with assertions that check that all of the
       * default data-cy elements exist and have the correct initial content.
       */
      cy.get('[data-cy="component-group"]').should('exist');
      cy.get('[data-cy="placeholder"]').should(
        'contain.text',
        'Replace this `p` element with your component content.'
      );
    });
  });
});
