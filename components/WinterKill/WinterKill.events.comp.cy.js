import WinterKill from '@comps/WinterKill/WinterKill.vue';

describe('Test the WinterKill component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /**
   * Does 4 checks on validity computation
   *
   * required   empty     test
   * false      false     1. valid event: Not required, not empty
   * false      true      2. valid event: Not required, empty
   * true       false     3. valid event: Required, not empty
   * true       true      4. valid event: Required, empty
   * true       true      false    5. valid event: Required, empty, not picked
   */

  it('1. valid event: Not required, not empty', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '2024-01-01',
        required: false,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('2. valid event: Not required, empty', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '',
        required: false,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('3. valid event: Required, not empty', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '2024-01-01',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('4. valid event: Required, empty', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('5. valid event: Required, empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: false,
        date: '',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Verify that `picked` prop is watched', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: false,
        date: '2024-01-01',
        required: true,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy').should('have.been.calledOnce');
      cy.get('@validSpy')
        .should('have.been.calledOnce')
        .and('have.been.calledWith', true);

      wrapper.setProps({ picked: true });
      cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    });
  });

  it('Emits "update:picked" when the checkbox is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        picked: false,
        date: '',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="winter-kill-checkbox"]').check();
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="winter-kill-checkbox"]').uncheck();
        cy.get('@updateSpy').should('have.been.calledTwice');
        cy.get('@updateSpy').should('have.been.calledWith', false);
      });
  });

  it('Verify that `date` prop is watched', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '2024-01-01',
        required: true,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy').should('have.been.calledOnce');
      cy.get('@validSpy')
        .should('have.been.calledOnce')
        .and('have.been.calledWith', true);

      wrapper.setProps({ date: '2030-01-01' });
      cy.get('[data-cy="winter-kill-date-input"]').should(
        'have.value',
        '2030-01-01'
      );
    });
  });

  it('Emits "update:date" when the date input is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        'onUpdate:date': updateSpy,
        picked: true,
        date: '2024-01-01',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="winter-kill-date-input"]').type('2030-02-01');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', '2030-02-01');
      });
  });

  it('Emits "valid" true when component becomes valid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
        cy.get('[data-cy="winter-kill-date-input"]').type('2024-02-01');
        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "valid" false when component becomes invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '2024-02-01',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
        cy.get('[data-cy="winter-kill-date-input"]').clear();
        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Does not emit "valid" if no change in validity', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(WinterKill, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        picked: true,
        date: '',
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="winter-kill-date-input"]').type('2024-02-01');
        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="winter-kill-date-input"]').type('2024-02-01');
        cy.get('@validSpy').should('have.been.calledTwice');
      });
  });
});
