import CropSelector from '@comps/CropSelector/CropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the permission based CropSelector content', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Admin can add crops and url is correct', () => {
    const readySpy = cy.spy().as('readySpy');
    const addClickedSpy = cy.spy().as('addClickedSpy');

    cy.mount(CropSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        onAddClicked: addClickedSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');

        // Simulate a click on the add button and check if the event is emitted
        // cy.get('[data-cy="selector-add-button"]').click();
        // cy.get('@addClickedSpy').should('have.been.calledOnce');
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
