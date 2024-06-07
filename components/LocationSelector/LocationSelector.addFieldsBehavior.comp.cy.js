import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the LocationSelector component behavior for land (i.e. field or bed)', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });
  it('Navigates to the add form and clears the fields and beds cache on add button click', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/asset/add/land', {
      statusCode: 200,
      body: 'Add location Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        includeGreenhouses: false,
        onReady: readySpy,
        allowBedSelection: true,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('fields')).to.not.be
            .null;
          expect(farmosUtil.getFromGlobalVariableCache('greenhouses')).to.be
            .null;
          expect(farmosUtil.getFromGlobalVariableCache('beds')).to.not.be.null;
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
