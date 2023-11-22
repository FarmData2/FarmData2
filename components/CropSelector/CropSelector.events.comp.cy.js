import CropSelector from '@comps/CropSelector/CropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the CropSelector events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Test that "valid" event is propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Test that "update:selection" event is propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('ASPARAGUS');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'ASPARAGUS');
      });
  });

  it('Test that error event is emitted', () => {
    farmosUtil.clearCachedCrops();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/taxonomy_term/plant_type?*', {
      forceNetworkError: true,
    });

    cy.mount(CropSelector, {
      props: {
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should('have.been.calledWith', 'Unable to fetch crops.');
    });
  });
});
