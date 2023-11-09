import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

describe('Test the SubmitResetButtons component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "ready" when component has been created', () => {
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
      });
  });

  it('Check submitEnabled prop is watched', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SubmitResetButtons, {
      props: {
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="submit-button"]').should('be.disabled');

          wrapper.setProps({ enableSubmit: true });

          cy.get('[data-cy="submit-button"]').should('not.be.disabled');
        });
    });
  });

  it('Check resetEnabled prop is watched', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SubmitResetButtons, {
      props: {
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="reset-button"]').should('be.disabled');

          wrapper.setProps({ enableReset: true });

          cy.get('[data-cy="reset-button"]').should('not.be.disabled');
        });
    });
  });

  it('Emits "submit" when submit button is clicked', () => {
    const readySpy = cy.spy().as('readySpy');
    const submitSpy = cy.spy().as('submitSpy');

    cy.mount(SubmitResetButtons, {
      props: {
        enableSubmit: true,
        onSubmit: submitSpy,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="submit-button"]').click();
        cy.get('@submitSpy').should('have.been.calledOnce');
      });
  });

  it('Emits "reset" when reset button is clicked', () => {
    const readySpy = cy.spy().as('readySpy');
    const resetSpy = cy.spy().as('resetSpy');

    cy.mount(SubmitResetButtons, {
      props: {
        enableReset: true,
        onReset: resetSpy,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="reset-button"]').click();
        cy.get('@resetSpy').should('have.been.calledOnce');
      });
  });
});
