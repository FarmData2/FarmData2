import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

describe('Test the default SubmitResetButtons content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the data-cy elements', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SubmitResetButtons, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="submit-reset"]').should('exist');
        cy.get('[data-cy="submit-button"]')
          .should('exist')
          .should('be.disabled')
          .should('have.text', 'Submit');
        cy.get('[data-cy="reset-button"]')
          .should('exist')
          .should('be.disabled')
          .should('have.text', 'Reset');
      });
  });

  it('Check enabled prop on submit button', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SubmitResetButtons, {
      props: {
        enableSubmit: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="submit-button"]')
          .should('exist')
          .should('not.be.disabled');
        cy.get('[data-cy="reset-button"]')
          .should('exist')
          .should('be.disabled');
      });
  });

  it('Check enabled prop on reset button', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SubmitResetButtons, {
      props: {
        enableReset: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="submit-button"]')
          .should('exist')
          .should('be.disabled');
        cy.get('[data-cy="reset-button"]')
          .should('exist')
          .should('not.be.disabled');
      });
  });
});
