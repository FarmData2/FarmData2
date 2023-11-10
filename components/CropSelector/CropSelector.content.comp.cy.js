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

  it('Check all of the data-cy elements exist', () => {
    cy.mount(CropSelector);

    cy.get('[data-cy="crop-group"]').should('exist');
    cy.get('[data-cy="crop-label"]').should('have.text', 'Crop:');
    cy.get('[data-cy="required-star"]').should('not.exist');
    cy.get('[data-cy="crop-select"]').should('exist');
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="option-0"]').should('have.value', '');
    cy.get('[data-cy="add-crop-button"]').should('exist');
    cy.get('[data-cy="crop-invalid-feedback"]').should('not.be.visible');
    cy.get('[data-cy="crop-invalid-feedback"]').should(
      'contain.text',
      'A crop selection is required.'
    );
  });

  it('Test required prop', () => {
    cy.mount(CropSelector, {
      props: {
        required: true,
      },
    });
    cy.get('[data-cy="required-star"]').should('exist');
    cy.get('[data-cy="required-star"]').should('have.text', '*');

    // No styling should appear because show invalid is false and initially empty is okay.
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="crop-invalid-feedback"]').should('not.be.visible');
  });

  it('Test showInvalid true when not required', () => {
    cy.mount(CropSelector, {
      props: {
        showinvalidStyling: true,
      },
    });

    // No styling should appear because empty is okay when not required.
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="crop-invalid-feedback"]').should('not.be.visible');
  });

  it('Test showInvalid true when required', () => {
    cy.mount(CropSelector, {
      props: {
        required: true,
        showInvalidStyling: true,
      },
    });

    // Styling should appear because empty is not okay when not required.
    cy.get('[data-cy="crop-select"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="crop-select"]').should('have.class', 'is-invalid');
    cy.get('[data-cy="crop-invalid-feedback"]').should('be.visible');
  });
});
