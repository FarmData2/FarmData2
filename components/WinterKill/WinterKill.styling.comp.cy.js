import WinterKill from '@comps/WinterKill/WinterKill.vue';

describe('Test the WinterKill styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * There are 16 possibilities for styling...
   *
   * required   showValidityStyling    empty     picked   Tested by Test
   * false      false                  false     false    1. Not Required, Not showing, not empty, not picked
   * false      false                  true      false    2. Not Required, Not showing, empty, not picked
   * false      true                   false     false    3. Not Required, Showing, not empty, not picked
   * false      true                   true      false    4. Not Required, Showing, empty, not picked
   * true       false                  false     false    5. Required, Not showing, not empty, not picked
   * true       false                  true      false    6. Required, Not showing, empty, not picked
   * true       true                   false     false    7. Required, Showing, not empty, not picked
   * true       true                   true      false    8. Required, Showing, empty, not picked
   * false      false                  false     true     9. Not Required, Not showing, not empty, picked
   * false      false                  true      true     10. Not Required, Not showing, empty, picked
   * false      true                   false     true     11. Not Required, Showing, not empty, picked
   * false      true                   true      true     12. Not Required, Showing, empty, picked
   * true       false                  false     true     13. Required, Not showing, not empty, picked
   * true       false                  true      true     14. Required, Not showing, empty, picked
   * true       true                   false     true     15. Required, Showing, not empty, picked
   * true       true                   true      true     16. Required, Showing, empty, picked
   */

  it('1. Not Required, Not showing, not empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: false,
        picked: false,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('2. Not Required, Not showing, empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: false,
        picked: false,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('3. Not Required, Showing, not empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: true,
        picked: false,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('4. Not Required, Showing, empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: true,
        picked: false,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('5. Required, Not showing, not empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: false,
        picked: false,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('6. Required, Not showing, empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: false,
        picked: false,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('7. Required, Showing, not empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: true,
        picked: false,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('8. Required, Showing, empty, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: true,
        picked: false,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('not.be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('not.exist');
  });

  it('9. Not Required, Not showing, not empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: false,
        picked: true,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should('not.exist');
  });

  it('10. Not Required, Not showing, empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: false,
        picked: true,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should('not.exist');
  });

  it('11. Not Required, Showing, not empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: true,
        picked: true,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should('not.exist');
  });

  it('12. Not Required, Showing, empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: false,
        showValidityStyling: true,
        picked: true,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should('not.exist');
  });

  it('13. Required, Not showing, not empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: false,
        picked: true,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should('not.exist');
  });

  it('14. Required, Not showing, empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: false,
        picked: true,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]')
      .should('exist')
      .should('not.be.visible');
  });

  it('15. Required, Showing, not empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: true,
        picked: true,
        date: '2024-01-01',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]').should('not.exist');
  });

  it('16. Required, Showing, empty, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(WinterKill, {
      props: {
        required: true,
        showValidityStyling: true,
        picked: true,
        date: '',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
    cy.get('[data-cy="winter-kill-checkbox"]').should('be.checked');
    cy.get('[data-cy="winter-kill-date-group"]').should('exist');
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'not.have.class',
      'is-valid'
    );
    cy.get('[data-cy="winter-kill-date-input"]').should(
      'have.class',
      'is-invalid'
    );
    cy.get('[data-cy="winter-kill-date-invalid-feedback"]')
      .should('exist')
      .should('be.visible');
  });
});
