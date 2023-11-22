import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the LocationSelector component events', () => {
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

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
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

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'CHUAU');
      });
  });

  it('Test that error event is emitted when fetching fields and beds fails', () => {
    farmosUtil.clearCachedFieldsAndBeds();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/land?*', {
      forceNetworkError: true,
    });

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should('have.been.calledWith', 'Unable to fetch locations.');
    });
  });

  it('Test that error event is emitted when fetching greenhouses fails', () => {
    farmosUtil.clearCachedGreenhouses();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/structure?*', {
      forceNetworkError: true,
    });

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should('have.been.calledWith', 'Unable to fetch locations.');
    });
  });
});
