import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

describe('Test the default DateSelect content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the data-cy elements', () => {
    /*
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    cy.mount(SubmitResetButtons);

    cy.get('[data-cy="new-comp-group"]').should('exist');
    cy.get('[data-cy="placeholder"]').should(
      'have.text',
      'Component content goes here.'
    );
  });
});