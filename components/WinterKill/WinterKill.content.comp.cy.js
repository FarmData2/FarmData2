import WinterKill from '@comps/WinterKill/WinterKill.vue';

describe('Test the default WinterKill content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the data-cy elements and default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="winter-kill-group"]').should('exist');
        cy.get('[data-cy="winter-kill-label"]').should(
          'have.text',
          'Winter kill:'
        );
        cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
        cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
      });
  });

  it('Test that props are passed', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        picked: true,
        required: true,
        date: '1999-01-02',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
        cy.get('[data-cy="winter-kill-date-group"]').should('exist');
        cy.get('[data-cy="winter-kill-date-required"]').should('exist');
        cy.get('[data-cy="winter-kill-date-required"]').should(
          'have.text',
          '*'
        );
        cy.get('[data-cy="winter-kill-date-input"]').should(
          'have.value',
          '1999-01-02'
        );
        cy.get('[data-cy="winter-kill-date-input"]').should(
          'have.class',
          'is-valid'
        );
        cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should(
          'not.exist'
        );
      });
  });

  it('Check invalid date input with validity styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        picked: true,
        required: true,
        date: 'invalid-date',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="winter-kill-date-input"]').should(
          'have.class',
          'is-invalid'
        );
        cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should(
          'be.visible'
        );
      });
  });
});
