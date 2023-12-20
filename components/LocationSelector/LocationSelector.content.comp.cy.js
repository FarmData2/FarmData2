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
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-selector"]').should('exist');
        cy.get('[data-cy="selector-group"]').should('exist');
      });
  });

  it('Check that required prop is false by default', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
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

  it('Test getting only greenhouses', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 6);
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'CHUAU');
        cy.get('[data-cy="selector-option-5"]').should(
          'have.text',
          'SEEDING BENCH'
        );
      });
  });

  it('Test getting only fields', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 66);
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'A');
        cy.get('[data-cy="selector-option-65"]').should('have.text', 'Z');
      });
  });

  it('Test getting fields and greenhouses', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 71);
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'A');
        cy.get('[data-cy="selector-option-70"]').should('have.text', 'Z');
      });
  });

  it('Check that props are passed through to the SelectorBase', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        required: true,
        showValidityStyling: true,
        selected: 'CHUAU',
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-label"]').should('have.text', 'Location:');
        cy.get('[data-cy="selector-required"]').should('have.text', '*');
        cy.get('[data-cy="selector-input"]').should('have.value', 'CHUAU');
        cy.get('[data-cy="selector-invalid-feedback"]').should(
          'contain.text',
          'A location is required'
        );
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-valid');
      });
  });

  it('Test getting only greenhouses', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-selector"]').should('exist');

        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', '/asset/add/structure');
      });
  });

  it('Test add url for fields', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-selector"]').should('exist');

        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', '/asset/add/land');
      });
  });

  it('Test add url for both fields and greenhouses', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-selector"]').should('exist');

        cy.get('[data-cy="selector-add-button"]')
          .should('have.attr', 'href')
          .then((href) => href)
          .should('eq', '/asset/add');
      });
  });
});
