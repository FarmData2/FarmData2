import MultiCropSelector from '@comps/MultiCropSelector/MultiCropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the MultiCropSelector permissions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can add crops', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      farmosUtil.getFarmOSInstance('http://farmos', 'farm', 'admin', 'admin')
    ).then(() => {
      cy.mount(MultiCropSelector, {
        props: {
          onReady: readySpy,
        },
      });

      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-add-button"]').should('exist');
        });
    });
  });

  it('Guest cannot add crop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.mount(MultiCropSelector, {
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
