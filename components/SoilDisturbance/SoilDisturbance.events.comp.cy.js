import SoilDisturbance from '@comps/SoilDisturbance/SoilDisturbance.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the SoilDisturbance component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Initial "valid" event is correct when not required', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@validSpy').should('have.been.calledOnce');
          cy.get('@validSpy').should('have.been.calledWith', true);
        });
    });
  });

  it('Initial "valid" event is correct when required', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Changing Equipment emits "valid" event correctly', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('Tractor');

        // One on creation of EquipmentSelector
        // One on selection of equipment.
        // One on creation of the depth, speed, area elements.
        cy.get('@validSpy').should('have.been.calledThrice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Changing depth emits "valid" event correctly', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        equipment: ['Tractor'],
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .as('depth');
        cy.get('@depth').clear();
        cy.get('@depth').blur();

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('@depth').clear();
        cy.get('@depth').type('10');
        cy.get('@depth').blur();

        cy.get('@validSpy').should('have.been.calledThrice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Changing speed emits "valid" event correctly', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        equipment: ['Tractor'],
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .as('speed');
        cy.get('@speed').clear();
        cy.get('@speed').blur();

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('@speed').clear();
        cy.get('@speed').type('5');
        cy.get('@speed').blur();

        cy.get('@validSpy').should('have.been.calledThrice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('"valid" event ignores area if not included', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        area: null,
        includeArea: false,
        equipment: ['Tractor'],
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Changing area emits "valid" event correctly', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        equipment: ['Tractor'],
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .as('area');
        cy.get('@area').clear();
        cy.get('@area').blur();

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('@area').clear();
        cy.get('@area').type('5');
        cy.get('@area').blur();

        cy.get('@validSpy').should('have.been.calledThrice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('"valid" event ignores passes if not included', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        equipment: ['Tractor'],
        passes: null,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Changing passes emits "valid" event correctly', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(SoilDisturbance, {
      props: {
        required: true,
        equipment: ['Tractor'],
        includePasses: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);

        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-input"]')
          .as('passes');
        cy.get('@passes').clear();
        cy.get('@passes').blur();

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('@passes').clear();
        cy.get('@passes').type('2');
        cy.get('@passes').blur();

        cy.get('@validSpy').should('have.been.calledThrice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Changing equipment emits "update:equipment" event', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SoilDisturbance, {
      props: {
        onReady: readySpy,
        'onUpdate:equipment': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('Tractor');

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', ['Tractor']);

        cy.get('[data-cy="selector-2"]')
          .find('[data-cy="selector-input"]')
          .select('Planter');

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', [
          'Tractor',
          'Planter',
        ]);
      });
  });

  it('Changing depth emits "update:depth" event', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        onReady: readySpy,
        'onUpdate:depth': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-depth"]')
          .find('[data-cy="numeric-input"]')
          .as('depth');
        cy.get('@depth').clear();
        cy.get('@depth').type('2');
        cy.get('@depth').blur();

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 2);
      });
  });

  it('Changing speed emits "update:speed" event', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        onReady: readySpy,
        'onUpdate:speed': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-speed"]')
          .find('[data-cy="numeric-input"]')
          .as('speed');
        cy.get('@speed').clear();
        cy.get('@speed').type('3');
        cy.get('@speed').blur();

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 3);
      });
  });

  it('Changing area emits "update:area" event', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        onReady: readySpy,
        'onUpdate:area': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-area"]')
          .find('[data-cy="numeric-input"]')
          .as('area');
        cy.get('@area').clear();
        cy.get('@area').type('50');
        cy.get('@area').blur();

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 50);
      });
  });

  it('Changing passes emits "update:passes" event', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(SoilDisturbance, {
      props: {
        equipment: ['Tractor'],
        includePasses: true,
        onReady: readySpy,
        'onUpdate:passes': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="soil-disturbance-passes"]')
          .find('[data-cy="numeric-input"]')
          .as('passes');
        cy.get('@passes').clear();
        cy.get('@passes').type('2');
        cy.get('@passes').blur();

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 2);
      });
  });

  it('Emits "error" if loading equipment fails', () => {
    farmosUtil.clearCachedEquipment();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/equipment?*', {
      forceNetworkError: true,
    });

    cy.mount(SoilDisturbance, {
      props: {
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should('have.been.calledWith', 'Unable to fetch equipment.');
    });
  });
});
