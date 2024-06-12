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

  it('Closing popup clears/repopulates the cache', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.spy(LocationSelector.methods, 'populate').as('populateSpy');
    cy.spy(LocationSelector.methods, 'handleAddClicked').as(
      'handleAddClickedSpy'
    );

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
          cy.get('[data-cy="closePopup"]').should('exist');
          cy.get('[data-cy="closePopup"]').click();

          cy.get('@handleAddClickedSpy').should('be.calledOnce');
          cy.get('@populateSpy').should('be.calledOnce');

          expect(farmosUtil.getFromGlobalVariableCache('fields')).to.not.be
            .null;
          expect(farmosUtil.getFromGlobalVariableCache('greenhouses')).to.be
            .null;
          expect(farmosUtil.getFromGlobalVariableCache('beds')).to.not.be.null;
        });
    });
  });
});
