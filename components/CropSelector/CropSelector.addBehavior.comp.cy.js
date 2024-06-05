import CropSelector from '@comps/CropSelector/CropSelector.vue';
// import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the CropSelector behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Clicking add crop button goes to the add crop form', () => {
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
          // let cropCache = farmosUtil.getFromGlobalVariableCache('crops');
          // console.log(farmosUtil.getFromGlobalVariableCache('crops'));
          // expect(farmosUtil.getFromGlobalVariableCache('crops')).to.not.be.null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.wait('@urlIntercept').its('response.statusCode');
          // cropCache = farmosUtil.getFromGlobalVariableCache('crops');
          // expect(cropCache).to.be.null;
        });
    });
  });
});
