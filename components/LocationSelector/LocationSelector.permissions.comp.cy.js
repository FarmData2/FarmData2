import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test permissions based content in the LocationSelector', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Verify that admin can add structure (i.e. greenhouse) by ensuring the add button is available to admin.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verify that admin can add land (i.e. field or bed) by ensuring the add button is available to admin.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verify that admin can add both land and structures by ensuring the add button is available to admin.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verify that guest cannot add land (i.e. field or bed) by ensuring the add button is not available to guest.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.mount(LocationSelector, {
        props: {
          includeFields: true,
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

  it('Verify that guest cannot add structures (e.g., greenhouse) by ensuring the add button is not available to guest.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.mount(LocationSelector, {
        props: {
          includeGreenhouses: true,
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

  it('Verify that guest cannot add both land and structure by ensuring the add button is not available to guest.', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.mount(LocationSelector, {
        props: {
          includeFields: true,
          includeGreenhouses: true,
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
