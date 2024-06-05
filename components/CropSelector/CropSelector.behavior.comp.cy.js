import CropSelector from '@comps/CropSelector/CropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the CropSelector behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/taxonomy/manage/plant_type/add', {
      statusCode: 200,
      body: 'Add Crop Form',
    }).as('urlIntercept');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('crops')).to.not.be.null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.wait('@urlIntercept')
            .its('response.statusCode')
            .should('eq', 200)
            .then(() => {
              expect(farmosUtil.getFromGlobalVariableCache('crops')).to.be.null;
            });
        });
    });
  });
});
