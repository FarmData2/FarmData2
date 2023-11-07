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
    cy.get('[data-cy="option-0"]').should('have.value', 'Choose crop...');
    cy.get('[data-cy="option-1"]').should('exist');
    cy.get('[data-cy="option-111"]').should('exist');
    cy.get('[data-cy="add-crop-button"]').should('exist');
    cy.get('[data-cy="crop-valid-text"]').should('have.text', 'Select crop.');
    cy.get('[data-cy="crop-invalid-text"]').should('not.be.visible');
    cy.get('[data-cy="crop-invalid-text"]').should(
      'have.text',
      'Crop selection is required.'
    );
  });

  it('Test the defaults when CropSelector is required', () => {
    cy.mount(CropSelector, {
      props: {
        required: true,
      },
    });
    cy.get('[data-cy="required-star"]').should('exist');
    cy.get('[data-cy="required-star"]').should('have.text', '*');
    cy.get('[data-cy="crop-valid-text"]').should('not.be.visible');
  });

  it('Test that custom validText and invalidText work', () => {
    cy.mount(CropSelector, {
      props: {
        validText: 'Testing valid text.',
        invalidText: 'Testing invalid text.',
      },
    });

    cy.get('[data-cy="crop-valid-text"]').should(
      'have.text',
      'Testing valid text.'
    );
    cy.get('[data-cy="crop-invalid-text"]').should(
      'have.text',
      'Testing invalid text.'
    );
  });

  it('Test showValidity with valid state', () => {
    cy.mount(CropSelector, {
      props: {
        showValidity: true,
      },
    });

    cy.get('[data-cy="crop-select"]').should('have.class', 'is-valid');
    cy.get('[data-cy="crop-valid-text"]').should('be.visible');
    cy.get('[data-cy="crop-invalid-text"]').should('not.be.visible');
  });

  it('Test showValidity with invalid state', () => {
    cy.mount(CropSelector, {
      props: {
        required: true,
        showValidity: true,
      },
    });

    cy.get('[data-cy="crop-select"]').should('have.class', 'is-invalid');
    cy.get('[data-cy="crop-valid-text"]').should('not.be.visible');
    cy.get('[data-cy="crop-invalid-text"]').should('be.visible');
  });
});
