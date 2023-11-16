import NumericInput from '@comps/NumericInput/NumericInput.vue';

describe('Test the NumericInput component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Test increase buttons', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 7,
        incDecValues: [1, 5, 20],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-increase-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '8');
        cy.get('[data-cy="numeric-increase-md"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '13');
        cy.get('[data-cy="numeric-increase-lg"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '33');
      });
  });

  it('Test decrease buttons', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(NumericInput, {
      props: {
        label: 'Test',
        invalidFeedbackText: 'Test feedback text',
        value: 50,
        incDecValues: [1, 5, 20],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="numeric-decrease-sm"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '49');
        cy.get('[data-cy="numeric-decrease-md"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '44');
        cy.get('[data-cy="numeric-decrease-lg"]').click();
        cy.get('[data-cy="numeric-input"]').should('have.value', '24');
      });
  });
});
