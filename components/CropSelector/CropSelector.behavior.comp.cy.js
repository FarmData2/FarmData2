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

  it('Closing popup clears/repopulates the cache', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.spy(CropSelector.methods, 'populate').as('populateSpy');
    cy.spy(CropSelector.methods, 'handleAddClicked').as('handleAddClickedSpy');

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
          cy.get('[data-cy="closePopup"]').should('exist');
          cy.get('[data-cy="closePopup"]').click();

          cy.get('@handleAddClickedSpy').should('be.calledOnce');
          cy.get('@populateSpy').should('be.calledOnce');

          expect(farmosUtil.getFromGlobalVariableCache('crops')).to.not.be.null;
        });
    });
  });
});
