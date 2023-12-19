import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the permission based CropSelector content', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Test admin can add tray size and url is correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TraySizeSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', '/admin/structure/taxonomy/manage/tray_size/add');
      });
  });

  it('Test guest cannot add tray size', () => {
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
      cy.mount(TraySizeSelector, {
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
