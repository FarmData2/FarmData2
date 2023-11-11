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
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    cy.mount(%COMPONENT_NAME%);

    cy.get('[data-cy="new-comp-group"]').should('exist');
    cy.get('[data-cy="placeholder"]').should(
      'have.text',
      'Component content goes here.'
    );
  });
});
