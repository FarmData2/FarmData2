import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';

describe('Test the SoilDisturbance component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('numeric fields appear when equipment is selected', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        includePasses: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-equipment-selector"]')
          .find('[data-cy="selector-input"]')
          .select('Tractor');

        cy.get('[data-cy="soil-disturbance-depth"]').should('exist');
        cy.get('[data-cy="soil-disturbance-speed"]').should('exist');
        cy.get('[data-cy="soil-disturbance-area"]').should('exist');
        cy.get('[data-cy="soil-disturbance-passes"]').should('exist');
      });
  });

  it('equipment prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Tractor');

          wrapper.setProps({ equipment: ['Planter'] });

          cy.get('[data-cy="selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Planter');
        });
    });
  });

  it('depth prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        depth: 10,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="soil-disturbance-depth"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '10.0');

          wrapper.setProps({ depth: 6 });

          cy.get('[data-cy="soil-disturbance-depth"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '6.0');
        });
    });
  });

  it('speed prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        speed: 10,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="soil-disturbance-speed"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '10.0');

          wrapper.setProps({ speed: 6 });

          cy.get('[data-cy="soil-disturbance-speed"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '6.0');
        });
    });
  });

  it('area prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        area: 75,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="soil-disturbance-area"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '75');

          wrapper.setProps({ area: 50 });

          cy.get('[data-cy="soil-disturbance-area"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '50');
        });
    });
  });

  it('passes prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        includePasses: true,
        passes: 2,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="soil-disturbance-passes"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '2');

          wrapper.setProps({ passes: 3 });

          cy.get('[data-cy="soil-disturbance-passes"]')
            .find('[data-cy="numeric-input"]')
            .should('have.value', '3');
        });
    });
  });
});
