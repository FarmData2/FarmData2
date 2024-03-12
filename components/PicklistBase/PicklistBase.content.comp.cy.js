import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the default PicklistBase content', () => {
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
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
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
