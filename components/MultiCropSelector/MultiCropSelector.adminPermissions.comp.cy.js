import MultiCropSelector from '@comps/MultiCropSelector/MultiCropSelector.vue';

describe('Test the MultiCropSelector permissions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can add crops', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/taxonomy/manage/plant_type/add', {
      statusCode: 200,
      body: 'Add Crop Form',
    }).as('urlIntercept');

    cy.mount(MultiCropSelector, {
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
