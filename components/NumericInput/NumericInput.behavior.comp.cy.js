import NumericInput from '@comps/NumericInput/NumericInput.vue';

describe('Test the NumericInput component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Add tests for behavior here', () => {
    /*
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    cy.mount(NumericInput);

    cy.get('[data-cy="new-comp-group"]').should('exist');
    cy.get('[data-cy="placeholder"]').should(
      'have.text',
      'Component content goes here.'
    );
  });
});
