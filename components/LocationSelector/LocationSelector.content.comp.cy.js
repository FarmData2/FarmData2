import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

describe('Test the default LocationSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check for the SelectorBase element', () => {
    cy.mount(LocationSelector);
    cy.get('[data-cy="location-selector"]').should('exist');
  });

  it('Check that required prop is false by default', () => {
    cy.mount(LocationSelector);
    cy.get('[data-cy="selector-required"]').should('not.exist');
  });

  it('Check that props are passed through to the SelectorBase', () => {
    cy.mount(LocationSelector, {
      props: {
        required: true,
      },
    });

    cy.get('[data-cy="selector-label"]').should('have.text', 'Location:');
    cy.get('[data-cy="selector-required"]').should('have.text', '*');
    cy.get('[data-cy="selector-invalid-feedback"]').should(
      'contain.text',
      'A location is required'
    );
  });

  it('Test add url for greenhouses', () => {
    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
      },
    });

    cy.get('[data-cy="location-selector"]').should('exist');

    cy.get('[data-cy="selector-add-button"]')
      .should('have.attr', 'href')
      .then((href) => href)
      .should('eq', '/asset/add/structure');
  });

  it('Test add url for fields', () => {
    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
      },
    });

    cy.get('[data-cy="location-selector"]').should('exist');

    cy.get('[data-cy="selector-add-button"]')
      .should('have.attr', 'href')
      .then((href) => href)
      .should('eq', '/asset/add/land');
  });

  it('Test add url for both fields and greenhouses', () => {
    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
      },
    });

    cy.get('[data-cy="location-selector"]').should('exist');

    cy.get('[data-cy="selector-add-button"]')
      .should('have.attr', 'href')
      .then((href) => href)
      .should('eq', '/asset/add');
  });
});
