import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the permission based TraySize content', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Verify admin can add tray size by checking the existence of the add button', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/admin/structure/taxonomy/manage/tray_size/add', {
      statusCode: 200,
      body: 'Add Tray Size Form',
    }).as('urlIntercept');

    cy.mount(TraySizeSelector, {
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

  it('Verify guest cannot add tray size by checking the existence of the add button', () => {
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
