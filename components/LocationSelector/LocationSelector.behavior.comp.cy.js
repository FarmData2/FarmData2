import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';

describe('Test the LocationSelector component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('selected prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        selected: 'CHUAU',
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should('have.value', 'CHUAU');
          wrapper.setProps({ selected: 'GHANA' });
          cy.get('[data-cy="selector-input"]').should('have.value', 'GHANA');
        });
    });
  });

  it('ShowValidityStyling prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        required: true,
        includeGreenhouses: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-invalid'
          );
          cy.get('[data-cy="selector-invalid-feedback"]').should(
            'not.be.visible'
          );

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="selector-input"]').should(
            'have.class',
            'is-invalid'
          );
          cy.get('[data-cy="selector-invalid-feedback"]').should('be.visible');
        });
    });
  });

  it('Correct beds are shown when a location with beds is selected.', () => {
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
        cy.get('[data-cy="location-beds-accordion"]').should('not.exist');

        // Greenhouse
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('[data-cy="location-beds-accordion"]').should('exist');
        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(0)
          .should('have.text', 'CHUAU-1');

        // No beds
        cy.get('[data-cy="selector-input"]').select('A');
        cy.get('[data-cy="location-beds-accordion"]').should('not.exist');

        // Field
        cy.get('[data-cy="selector-input"]').select('ALF');
        cy.get('[data-cy="location-beds-accordion"]').should('exist');
        cy.get('[data-cy="picker-options"]')
          .children()
          .eq(0)
          .should('have.text', 'ALF-1');
      });
  });

  it('pickedBeds prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        selected: 'CHUAU',
        pickedBeds: ['CHUAU-1', 'CHUAU-3'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should('have.value', 'CHUAU');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(2)
            .should('be.checked');

          wrapper.setProps({ pickedBeds: ['CHUAU-2', 'CHUAU-4'] });

          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(0)
            .should('not.be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(1)
            .should('be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(2)
            .should('not.be.checked');
          cy.get('[data-cy="picker-options"]')
            .find('input')
            .eq(3)
            .should('be.checked');
        });
    });
  });

  it('1. selectAllBedsByDefault = true, when a location with beds is selected, all beds are checked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
        selectAllBedsByDefault: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('[data-cy="location-beds-accordion"]').should('exist');
        cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
          'be.checked'
        );
      });
  });

  it('2. selectAllBedsByDefault = false, when a location with beds is selected, no beds are checked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
        selectAllBedsByDefault: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('[data-cy="location-beds-accordion"]').should('exist');
        cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
          'not.be.checked'
        );
      });
  });

  it('3. selectAllBedsByDefault prop starts false, select a location (none checked), then change prop to true, select another location (all checked)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
        selectAllBedsByDefault: false,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.then(() => {
            cy.get('[data-cy="selector-input"]').select('CHUAU');
            cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
              'not.be.checked'
            );
          }).then(() => {
            wrapper.setProps({ selectAllBedsByDefault: true });
            cy.get('[data-cy="selector-input"]').select('ALF');
            cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
              'be.checked'
            );
          });
        });
    });
  });

  it('4. selectAllBedsByDefault prop starts true, select a location (all checked), then change prop to false, select another location (none checked)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
        selectAllBedsByDefault: true,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.then(() => {
            cy.get('[data-cy="selector-input"]').select('CHUAU');
            cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
              'be.checked'
            );
          }).then(() => {
            wrapper.setProps({ selectAllBedsByDefault: false });

            cy.get('[data-cy="selector-input"]').select('ALF');
            cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
              'not.be.checked'
            );
          });
        });
    });
  });

  it(`5. selectAllBedsByDefault = true, switch locations: ensure each newly selected location's beds are all checked`, () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
        selectAllBedsByDefault: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
          'be.checked'
        );

        cy.get('[data-cy="selector-input"]').select('ALF');
        cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
          'be.checked'
        );
      });
  });

  it(`6. selectAllBedsByDefault = false, switch locations: ensure each newly selected location's beds are all unchecked`, () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        includeFields: true,
        onReady: readySpy,
        selectAllBedsByDefault: false,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
          'not.be.checked'
        );

        cy.get('[data-cy="selector-input"]').select('ALF');
        cy.get('[data-cy="picker-options"] input[type="checkbox"]').should(
          'not.be.checked'
        );
      });
  });
});
