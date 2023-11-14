import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

describe('Test the LocationSelector component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Test that "valid" event is propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
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

  it('Test that "update:selection" event is propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'CHUAU');
      });
  });
});
