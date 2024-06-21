import WinterKill from '@comps/WinterKill/WinterKill.vue';

describe('Test the WinterKill component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Component reacts to changed picked prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        picked: false,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
          cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');

          wrapper.setProps({ picked: true });

          cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
          cy.get('[data-cy="winter-kill-date-group"]').should('exist');
        });
    });
  });

  it('Component reacts to changed date prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        picked: true,
        date: '1999-01-02',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="winter-kill-date-input"]').should(
            'have.value',
            '1999-01-02'
          );

          wrapper.setProps({ date: '1999-01-03' });

          cy.get('[data-cy="winter-kill-date-input"]').should(
            'have.value',
            '1999-01-03'
          );
        });
    });
  });

  it('Component reacts to changed showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        picked: true,
        required: true,
        date: 'invalid-date',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="winter-kill-date-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="winter-kill-date-input"]').should(
            'not.have.class',
            'is-invalid'
          );

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="winter-kill-date-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="winter-kill-date-input"]').should(
            'have.class',
            'is-invalid'
          );
        });
    });
  });
});
