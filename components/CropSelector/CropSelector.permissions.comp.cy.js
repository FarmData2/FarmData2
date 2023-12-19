import CropSelector from '@comps/CropSelector/CropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the permission based CropSelector content', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Admin can add crops and url is correct', () => {
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
        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', '/admin/structure/taxonomy/manage/plant_type/add');
      });
  });

  it('Guest can not add crops', () => {
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
