import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the TraySizeSelector behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Closing popup via close button does not clear/repopulate the cache', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.spy(TraySizeSelector.methods, 'populateTraySizeList').as('populateSpy');
    cy.spy(TraySizeSelector.methods, 'handleAddClicked').as(
      'handleAddClickedSpy'
    );

    cy.mount(TraySizeSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('tray_sizes')).to.not.be
            .null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.get('[data-cy="selector-closePopup"]').should('exist');
          cy.get('[data-cy="selector-closePopup"]').click();

          cy.get('@handleAddClickedSpy').should('be.calledOnce');
          cy.get('@populateSpy').should('not.be.called');

          expect(farmosUtil.getFromGlobalVariableCache('tray_sizes')).to.not.be
            .null;
        });
    });
  });
});
