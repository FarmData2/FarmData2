import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the LocationSelector component behavior for structures (e.g., greenhouse)', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Navigates to the add form and clears the greenhouses cache on add button click', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/asset/add/structure', {
      statusCode: 200,
      body: 'Add location Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeFields: false,
        includeGreenhouses: true,
        allowBedSelection: false,
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('fields')).to.be.null;
          expect(farmosUtil.getFromGlobalVariableCache('greenhouses')).to.not.be
            .null;
          expect(farmosUtil.getFromGlobalVariableCache('beds')).to.be.null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.wait('@urlIntercept')
            .its('response.statusCode')
            .should('eq', 200)
            .then(() => {
              expect(farmosUtil.getFromGlobalVariableCache('fields')).to.be
                .null;
              expect(farmosUtil.getFromGlobalVariableCache('greenhouses')).to.be
                .null;
              expect(farmosUtil.getFromGlobalVariableCache('beds')).to.be.null;
            });
        });
    });
  });
});
