import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';

describe('Test the default SoilDisturbance content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Default data-cy elements exist', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-group"]').should('exist');
        cy.get('[data-cy="soil-disturbance-equipment-selector"]').should(
          'exist'
        );
        cy.get('[data-cy="soil-disturbance-depth"]').should('not.exist');
        cy.get('[data-cy="soil-disturbance-speed"]').should('not.exist');
        cy.get('[data-cy="soil-disturbance-area"]').should('not.exist');
        cy.get('[data-cy="soil-disturbance-passes"]').should('not.exist');
      });
  });

  it('Check required prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-required"]')
          .should('exist');
      });
  });

  it('Check showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.class', 'is-invalid');
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-invalid-feedback"]')
          .should('be.visible');
      });
  });

  it('Check equipment prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor', 'Planter'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Tractor');
        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Planter');
        cy.get('[data-cy="selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
      });
  });

  it('Check area, depth, speed, and passes props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        depth: 10,
        speed: 5,
        area: 50,
        passes: 2,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '10.0');
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '5.0');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '50');
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '2');
      });
  });

  it('Check includePasses prop as false', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: false,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-passes"]').should('not.exist');
      });
  });

  it('Numeric fields marked required', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        required: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-required"]')
          .should('exist');
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-required"]')
          .should('exist');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-required"]')
          .should('exist');
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-required"]')
          .should('exist');
      });
  });

  it('Numeric fields have validity styling', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .should('have.class', 'is-valid');
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .should('have.class', 'is-valid');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.class', 'is-valid');
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-input"]')
          .should('have.class', 'is-valid');
      });
  });

  it('Depth increments are correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-increase-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '1.0');
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-increase-md"]')
          .click();
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '7.0');

        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-increase-lg"]')
          .should('not.exist');
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-decrease-lg"]')
          .should('not.exist');

        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-decrease-md"]')
          .click();
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '1.0');
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '0.0');
      });
  });

  it('Depth min is correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .should('be.disabled');
      });
  });

  it('Speed increments are correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-increase-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '1.0');
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-increase-md"]')
          .click();
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '6.0');

        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-increase-lg"]')
          .should('not.exist');
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-decrease-lg"]')
          .should('not.exist');

        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-decrease-md"]')
          .click();
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '1.0');
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '0.0');
      });
  });

  it('Speed min is correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .should('be.disabled');
      });
  });

  it('Area increments are correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-decrease-lg"]')
          .click();
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '75');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-decrease-md"]')
          .click();
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '65');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '60');

        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-increase-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '65');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-increase-md"]')
          .click();
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '75');
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-increase-lg"]')
          .click();
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '100');
      });
  });

  it('Area min/max are correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-increase-sm"]')
          .should('be.disabled');

        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .as('area');
        cy.get('@area').clear();
        cy.get('@area').type('1');
        cy.get('@area').blur();

        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .should('be.disabled');
      });
  });

  it('Passes increments are correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-increase-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '2');

        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-increase-md"]')
          .should('not.exist');
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-increase-lg"]')
          .should('not.exist');
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-decrease-lg"]')
          .should('not.exist');
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-decrease-md"]')
          .should('not.exist');

        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .click();
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-input"]')
          .should('have.value', '1');
      });
  });

  it('Passes min/max are correct', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-decrease-sm"]')
          .should('be.disabled');
      });
  });
});
