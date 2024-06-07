import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

describe('Test the default LocationSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Verifies the add button is available for greenhouses with beds', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/asset/add/structure', {
      statusCode: 200,
      body: 'Add Structure Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhousesWithBeds: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });
});
