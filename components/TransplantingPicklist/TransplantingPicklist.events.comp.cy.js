import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

describe('Test the TransplantingPicklist component events', () => {
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

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });
});
