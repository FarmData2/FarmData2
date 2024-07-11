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

  it('The base elements exist', () => {
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
        cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
      });
  });

  it('Required prop is false by default', () => {
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

  it('Get only greenhouses', () => {
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
          .should('have.length', 4); // Includes '' first item.
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'CHUAU');
        cy.get('[data-cy="selector-option-2"]').should('have.text', 'GHANA');
        cy.get('[data-cy="selector-option-3"]').should('have.text', 'JASMINE');
      });
  });

  it('Get only fields', () => {
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
          .should('have.length', 10); // includes '' first item.
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'A');
        cy.get('[data-cy="selector-option-9"]').should('have.text', 'H');
      });
  });

  it('Get both fields and greenhouses', () => {
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
          .should('have.length', 13); // includes '' first item.
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'A');
        cy.get('[data-cy="selector-option-12"]').should('have.text', 'JASMINE');
      });
  });

  it('Get only greenhouses that have beds', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhousesWithBeds: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 3); // includes '' first item.
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'CHUAU');
        cy.get('[data-cy="selector-option-2"]').should('have.text', 'GHANA');
      });
  });

  it('Both includeGreenhouses and includeGreenhousesWithBeds gives all greenhouses', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeGreenhousesWithBeds: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 4); // includes '' first item.
        cy.get('[data-cy="selector-option-1"]').should('have.text', 'CHUAU');
        cy.get('[data-cy="selector-option-2"]').should('have.text', 'GHANA');
        cy.get('[data-cy="selector-option-3"]').should('have.text', 'JASMINE');
      });
  });

  it('Props are passed through to the SelectorBase', () => {
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

  it('Props are passed through to the BedPicker', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        required: true,
        showValidityStyling: true,
        selected: 'CHUAU',
        pickedBeds: ['CHUAU-1', 'CHUAU-3'],
        requireBedSelection: true,
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-beds-accordion"]').should('exist');
        cy.get('[data-cy="location-beds-accordion-item"]').should('exist');

        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('have.class', 'is-valid');

        cy.get('[data-cy="picker-required"]').should('have.text', '*');

        cy.get('[data-cy="location-beds-accordion-title"]').should(
          'contain.text',
          'Select Beds'
        );

        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(0)
          .should('be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(1)
          .should('not.be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(2)
          .should('be.checked');
        cy.get('[data-cy="picker-options"]')
          .find('input')
          .eq(3)
          .should('not.be.checked');
      });
  });

  it('BedPicker can be disabled with allowBedSelection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        required: true,
        showValidityStyling: true,
        selected: 'CHUAU',
        allowBedSelection: false,
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
      });
  });

  it('Verifies the add button is available for fields', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/asset/add/land', {
      statusCode: 200,
      body: 'Add Land Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verifies the add button is available for greenhouses', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/asset/add/structure', {
      statusCode: 200,
      body: 'Add Structure Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verifies the add button is available for greenhouses with beds', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/asset/add/structure', {
      statusCode: 200,
      body: 'Add Structure Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhousesWithBeds: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verifies the add button is available for both fields and greenhouses is correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/asset/add', {
      statusCode: 200,
      body: 'Add Asset Form',
    }).as('urlIntercept');

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
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Verifies the add button is available for both fields and greenhouses with beds is correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '/asset/add', {
      statusCode: 200,
      body: 'Add Asset Form',
    }).as('urlIntercept');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhousesWithBeds: true,
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
      });
  });

  it('Location plus button exists, is visible, is enabled', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(LocationSelector, {
      props: {
        includeGreenhousesWithBeds: true,
        includeFields: true,
        onReady: readySpy,
      },
    });

    cy.get('[data-cy="selector-add-button"]')
      .should('exist')
      .should('be.visible')
      .should('be.enabled');
  });
});
