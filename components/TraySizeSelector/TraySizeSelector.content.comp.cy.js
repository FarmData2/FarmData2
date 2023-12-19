import TraySizeSelector from '@comps/TraySizeSelector/TraySizeSelector.vue';

describe('Test the TraySizeSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check for the SelectorBase element being used for the TraySizeSelector', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TraySizeSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="tray-size-selector"]').should('exist');
      });
  });

  it('Check that required prop is false by default', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TraySizeSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-required"]').should('not.exist');
      });
  });

  it('Check that props are passed through to the SelectorBase', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TraySizeSelector, {
      props: {
        required: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-label"]').should('have.text', 'Tray Size:');
        cy.get('[data-cy="selector-required"]').should('have.text', '*');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'A tray size is required'
        );
      });
  });
});
