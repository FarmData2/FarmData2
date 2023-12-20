import CropSelector from '@comps/CropSelector/CropSelector.vue';

describe('Test the CropSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check for the SelectorBase element being used for the CropSelector', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-selector"]').should('exist');
        cy.get('[data-cy="selector-group"]').should('exist');
      });
  });

  it('Check that required prop is false by default', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
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

  it('Test that crops are loaded', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 112);
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'ARUGULA');
        cy.get('[data-cy="selector-option-111"]').should(
          'have.text',
          'ZUCCHINI'
        );
      });
  });

  it('Check that props are passed through to the SelectorBase', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CropSelector, {
      props: {
        required: true,
        showValidityStyling: true,
        selected: 'ARUGULA',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-label"]').should('have.text', 'Crop:');
        cy.get('[data-cy="selector-required"]').should('have.text', '*');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'A crop is required'
        );
        cy.get('[data-cy="selector-input"]').should('have.value', 'ARUGULA');
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');
        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', '/admin/structure/taxonomy/manage/plant_type/add');
      });
  });
});
