import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the EquipmentSelector component behavior', () => {
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

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        selected: ['Tractor'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Tractor');
        })
        .then(() => {
          /*
           * Without extra then here, the wrapper.setProps usually executes before
           * the cy.get() above, causing the test to fail.
           */
          wrapper.setProps({ selected: ['Planter', 'Tractor'] });
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Planter');
          cy.get('[data-cy="selector-2"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Tractor');
        });
    });
  });

  it('Closing popup via close button does not clear/repopulate the cache', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.spy(EquipmentSelector.methods, 'populateEquipmentList').as(
      'populateSpy'
    );
    cy.spy(EquipmentSelector.methods, 'handleAddClicked').as(
      'handleAddClickedSpy'
    );

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('equipment')).to.not.be
            .null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.get('[data-cy="selector-closePopup"]').should('exist');
          cy.get('[data-cy="selector-closePopup"]').click();

          cy.get('@handleAddClickedSpy').should('be.calledOnce');
          cy.get('@populateSpy').should('not.be.called');

          expect(farmosUtil.getFromGlobalVariableCache('equipment')).to.not.be
            .null;
        });
    });
  });
});
