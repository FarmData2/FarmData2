import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

describe('Test the  DateSelect component behavior', () => {
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

    const readySpy = cy.spy().as('readySpy');

    cy.mount(SubmitResetButtons, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="new-comp-group"]').should('exist');
        cy.get('[data-cy="placeholder"]').should(
          'have.text',
          'Component content goes here.'
        );
      });
  });
});
