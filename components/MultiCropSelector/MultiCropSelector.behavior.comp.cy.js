import MultiCropSelector from '@comps/MultiCropSelector/MultiCropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the MultiCropSelector component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check selected prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
        selected: ['BROCCOLI'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'BROCCOLI');
        })
        .then(() => {
          /*
           * Without extra then here, the wrapper.setProps usually executes before
           * the cy.get() above, causing the test to fail.
           */
          wrapper.setProps({ selected: ['BROCCOLI', 'ARUGULA'] });
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'BROCCOLI');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'ARUGULA');
        });
    });
  });

  it('Closing popup via close button does not clear/repopulate the cache', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.spy(MultiCropSelector.methods, 'populateCropList').as('populateSpy');
    cy.spy(MultiCropSelector.methods, 'handleAddClicked').as(
      'handleAddClickedSpy'
    );

    cy.mount(MultiCropSelector, {
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
          cy.get('[data-cy="selector-closePopup"]').should('exist');
          cy.get('[data-cy="selector-closePopup"]').click();

          cy.get('@handleAddClickedSpy').should('be.calledOnce');
          cy.get('@populateSpy').should('not.be.called');

          expect(farmosUtil.getFromGlobalVariableCache('crops')).to.not.be.null;
        });
    });
  });
});
