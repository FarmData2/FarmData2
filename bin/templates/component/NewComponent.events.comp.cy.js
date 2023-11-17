import %COMPONENT_NAME% from '@comps/%COMPONENT_NAME%/%COMPONENT_NAME%.vue';

describe('Test the %COMPONENT_NAME% component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" when component has been created', () => {
    /*
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(%COMPONENT_NAME%, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
    .should('have.been.calledOnce')
    .then(() => {
      cy.get('@validSpy').shoud('have.been.calledOnce');
      cy.get('@validSpy').shoud('have.been.calledWith', false);
    });
  });
});
