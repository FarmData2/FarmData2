import CropSelector from '@comps/CropSelector/CropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the permission based CropSelector content', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Verify admin can add crops by checking the existence of the add button', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
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

  it('Verify guest cannot add crops by checking the existence of the add button', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.wrap(
      /*
       * Create a farmOS instance as guest. That way when the component
       * gets its instance using no parameters, it will get the one that
       * is authorized as guest as well.
       */
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.mount(CropSelector, {
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
