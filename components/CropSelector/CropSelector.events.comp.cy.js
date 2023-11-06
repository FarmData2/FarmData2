import CropSelector from '@comps/CropSelector/CropSelector.vue';

describe('Test the CropSelector events', () => {
  it('Emits "ready" when crops are fetched', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');

    cy.get('[data-cy="crop-select"] option').should('have.length', 112);
    cy.get('[data-cy="option-1"]').should('have.text', 'ARUGULA');
    cy.get('[data-cy="option-111"]').should('have.text', 'ZUCCHINI');
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
    }).then(() => {
      cy.get('[data-cy="crop-select"]').select('ARUGULA');
      cy.get('@updateSpy').should('have.been.calledOnce');
      cy.get('@updateSpy').should('have.been.calledWith', 'ARUGULA');
    });
  });

  it('Emits "error" when unable to connect to farm', () => {
    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('POST', '**/oauth/token', {
      forceNetworkError: true,
    });

    cy.mount(CropSelector, {
      props: {
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy').should('have.been.calledOnce');
      cy.get('@errorSpy').should(
        'have.been.calledWith',
        'Unable to connect to farm.'
      );
    });
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
    }).then(() => {
      cy.get('@errorSpy').should('have.been.calledOnce');
      cy.get('@errorSpy').should(
        'have.been.calledWith',
        'Unable to fetch crops.'
      );
    });
  });
});
