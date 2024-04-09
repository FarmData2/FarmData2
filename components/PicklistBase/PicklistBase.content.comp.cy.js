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
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {});
  });
});
