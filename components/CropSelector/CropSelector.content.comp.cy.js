import CropSelector from '@comps/CropSelector/CropSelector.vue';

describe('Test the default CropSelector content', () => {
  it('Check all of the data-cy elements', () => {
    cy.mount(CropSelector);

    cy.get('[data-cy="crop-group"]').should('exist');
    cy.get('[data-cy="crop-label"]').should('have.text', 'Crop:');
    cy.get('[data-cy="required-star"]').should('not.exist');
    cy.get('[data-cy="crop-select"]').should('exist');
    cy.get('[data-cy="option-0"]').should('have.value', 'Choose crop...');
    cy.get('[data-cy="option-1"]').should('exist');
    cy.get('[data-cy="option-111"]').should('exist');
    cy.get('[data-cy="add-crop-button"]').should('exist');
    cy.get('[data-cy="crop-help"]').should('have.text', 'Select crop.');
  });

  it('Test that required indicator can be shown', () => {
    cy.mount(CropSelector, {
      props: {
        required: true,
      },
    });
    cy.get('[data-cy="required-star"]').should('exist');
    cy.get('[data-cy="required-star"]').should('have.text', '*');
  });

  it('Test that help text is shown', () => {
    cy.mount(CropSelector, {
      props: {
        helpText: 'Testing help text.',
      },
    });
    cy.get('[data-cy="crop-help"]').should('have.text', 'Testing help text.');
  });
});
