import CropSelector from '@comps/CropSelector/CropSelector.vue';

describe('Test the CropSelector behaviors', () => {
  it('Clicking add crop button goes to add crop form', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/taxonomy/manage/plant_type/add', {
      statusCode: 200,
      body: 'Add Crop Form',
    }).as('urlIntercept');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="add-crop-button"]').should('exist');
          cy.get('[data-cy="add-crop-button"]').click();
          cy.wait('@urlIntercept').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
          });
        });
    });
  });
});
