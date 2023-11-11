import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the SelectorBase behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Clicking add button goes to the addUrl', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', 'http://farmos', {
      statusCode: 200,
      body: 'Add Option Form',
    }).as('urlIntercept');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
        addOptionUrl: 'http://farmos',
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
