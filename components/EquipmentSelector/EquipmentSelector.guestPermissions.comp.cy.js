import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the EquipmentSelector permissions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Guest cannot add equipment', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.mount(EquipmentSelector, {
        props: {
          onReady: readySpy,
        },
      });

      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-add-button"]').should('not.exist');
        });
    });
  });
});
