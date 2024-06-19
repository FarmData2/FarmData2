import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';

describe('Test the EquipmentSelector permissions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can add equipment', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', 'asset/add/equipment', {
      statusCode: 200,
      body: 'Add Equipment Form',
    }).as('urlIntercept');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
        cy.get('[data-cy="selector-add-button"]').click();
        cy.wait('@urlIntercept').its('response.statusCode').should('eq', 200);
      });
  });
});
