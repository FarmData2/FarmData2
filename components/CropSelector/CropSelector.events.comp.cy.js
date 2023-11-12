import CropSelector from '@comps/CropSelector/CropSelector.vue';

describe('Test the CropSelector events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "ready" when crops are fetched', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-select"] option').should('have.length', 112);
        cy.get('[data-cy="option-1"]').should('have.text', 'ARUGULA');
        cy.get('[data-cy="option-111"]').should('have.text', 'ZUCCHINI');
      });
  });

  it('Emits "valid" on creation', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Verify that `selected` prop is watched', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
        selected: null,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ selected: 'ARUGULA' });
          cy.get('@updateSpy').should('have.been.calledOnce');
          cy.get('[data-cy="crop-select"]').should('have.value', 'ARUGULA');
        });
    });
  });

  it('Emits "update:selected" when crop is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-select"]').select('ARUGULA');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'ARUGULA');
      });
  });

  it('Emits "valid" when a valid crop is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(CropSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledWith', false); // during creation.
        cy.get('[data-cy="crop-select"]').select('ARUGULA');
        cy.get('@validSpy').should('have.been.calledTwice'); // on creation and on selection.
        cy.get('@validSpy').should('have.been.calledWith', true); // during selection.
      });
  });

  it('Only emits "valid" when validity changes', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(CropSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce'); // on creation.
        cy.get('[data-cy="crop-select"]').select('ARUGULA');
        cy.get('@validSpy').should('have.been.calledTwice'); // on selection.
        cy.get('[data-cy="crop-select"]').select('BROCCOLI');
        cy.get('@validSpy').should('have.been.calledTwice'); // but not again - no change in validity.
        cy.get('[data-cy="crop-select"]').select('ZUCCHINI');
        cy.get('@validSpy').should('have.been.calledTwice');
      });
  });

  // it('Watches showValidity prop', () => {
  //   const readySpy = cy.spy().as('readySpy');

  //   cy.mount(CropSelector, {
  //     props: {
  //       required: true,
  //       onReady: readySpy,
  //     },
  //   }).then(({ wrapper }) => {
  //     cy.get('@readySpy')
  //       .should('have.been.calledOnce')
  //       .then(() => {
  //         cy.get('[data-cy="crop-select"]').should(
  //           'not.have.class',
  //           'is-valid'
  //         );
  //         cy.get('[data-cy="crop-select"]').should(
  //           'not.have.class',
  //           'is-invalid'
  //         );

  //         wrapper.setProps({ showInvalidStyling: true });

  //         cy.get('[data-cy="crop-select"]').should('have.class', 'is-invalid');
  //       });
  //   });
  // });

  it('Emits "error" when unable to connect to farm', () => {
    const errorSpy = cy.spy().as('errorSpy');

    cy.clearLocalStorage();

    cy.intercept('POST', '**/oauth/token', {
      forceNetworkError: true,
    });

    cy.mount(CropSelector, {
      props: {
        onError: errorSpy,
      },
    });

    cy.get('@errorSpy').should('have.been.calledOnce');
    cy.get('@errorSpy').should(
      'have.been.calledWith',
      'Unable to connect to farmOS server.'
    );
  });

  it('Emits "error" when unable to fetch crops', () => {
    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/taxonomy_term/plant_type?*', {
      forceNetworkError: true,
    });

    cy.mount(CropSelector, {
      props: {
        onError: errorSpy,
      },
    });

    cy.get('@errorSpy').should('have.been.calledOnce');
    cy.get('@errorSpy').should(
      'have.been.calledWith',
      'Unable to fetch crops.'
    );
  });
});
