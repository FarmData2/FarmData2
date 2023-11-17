import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';

describe('Test the TraySizeSelector behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Clicking add tray size button goes to the add tray size form', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/taxonomy/manage/tray_size/add', {
      statusCode: 200,
      body: 'Add Tray Size Form',
    }).as('urlIntercept');

    cy.mount(TraySizeSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.wait('@urlIntercept').its('response.statusCode').should('eq', 200);
        });
    });
  });
});
