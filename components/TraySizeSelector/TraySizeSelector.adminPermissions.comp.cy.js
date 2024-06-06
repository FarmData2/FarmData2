import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';

describe('Test the permission based CropSelector content', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Test admin can add tray size and url is correct', () => {
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
        cy.get('[data-cy="selector-add-button"]').click();
        cy.wait('@urlIntercept').its('response.statusCode').should('eq', 200);
      });
  });
});
