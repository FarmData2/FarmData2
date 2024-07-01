import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the EquipmentSelector component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" false on creation if required and no equipment is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
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

  it('Emits "valid" true on creation if not required and no equipment is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
      props: {
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

  it('Emits "valid" true on creation if required and one piece of equipment is selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['Tractor'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // one call in created() and one due to change in isValid.
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits "valid" true on creation if required and multiple equipment are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['Tractor', 'Planter'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Emits valid false when required and prop changed to contain no selections', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['Tractor', 'Planter'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@validSpy').should('have.been.calledOnce');
          cy.get('@validSpy').should('have.been.calledWith', true);
        })
        .then(() => {
          wrapper.setProps({ selected: [] });
          cy.get('@validSpy').should('have.been.calledTwice');
          cy.get('@validSpy').should('have.been.calledWith', false);
        });
    });
  });

  it('Emits valid true when not required and prop changed to contain no selections', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(EquipmentSelector, {
      props: {
        required: false,
        onReady: readySpy,
        onValid: validSpy,
        selected: ['Tractor', 'Planter'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@validSpy').should('have.been.calledOnce');
          cy.get('@validSpy').should('have.been.calledWith', true);
        })
        .then(() => {
          wrapper.setProps({ selected: [] });
          cy.get('@validSpy').should('have.been.called');
        });
    });
  });

  it('Emits "update:selected" when first selection is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('Tractor');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', ['Tractor']);
      });
  });

  it('Emits "update:selected" with array when second selection is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(EquipmentSelector, {
      props: {
        selected: ['Tractor'],
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
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

  it('Emits "error" if loading equipment fails', () => {
    farmosUtil.clearCachedEquipment();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/equipment?*', {
      forceNetworkError: true,
    });

    cy.mount(EquipmentSelector, {
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
