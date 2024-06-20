import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the EquipmentSelector component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check selected prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        selected: ['Tractor'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="equipment-selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Tractor');
        })
        .then(() => {
          /*
           * Without extra then here, the wrapper.setProps usually executes before
           * the cy.get() above, causing the test to fail.
           */
          wrapper.setProps({ selected: ['Planter', 'Tractor'] });
          cy.get('[data-cy="equipment-selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Planter');
          cy.get('[data-cy="equipment-selector-2"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'Tractor');
        });
    });
  });

  it('Making selections adds another selector', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="equipment-selector-2"]').should('not.exist');
        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');
        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('Tractor');

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('not.exist');
        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('exist');

        cy.get('[data-cy="equipment-selector-2"]').should('exist');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
      });
  });

  it('Delete button can remove first selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        selected: ['Planter', 'Seeding Drill', 'Tractor'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Planter');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Seeding Drill');
        cy.get('[data-cy="equipment-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Tractor');
        cy.get('[data-cy="equipment-selector-4"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Seeding Drill');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Tractor');
        cy.get('[data-cy="equipment-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="equipment-selector-4"]').should('not.exist');
      });
  });

  it('Delete button can remove last selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        selected: ['Planter', 'Seeding Drill', 'Tractor'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="equipment-selector-3"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Planter');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Seeding Drill');
        cy.get('[data-cy="equipment-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="equipment-selector-4"]').should('not.exist');
      });
  });

  it('Delete button can remove a middle selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        selected: ['Planter', 'Seeding Drill', 'Tractor'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Planter');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Tractor');
        cy.get('[data-cy="equipment-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="equipment-selector-4"]').should('not.exist');
      });
  });

  it('Closing popup via close button does not clear/repopulate the cache', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.spy(EquipmentSelector.methods, 'populateEquipmentList').as(
      'populateSpy'
    );
    cy.spy(EquipmentSelector.methods, 'handleAddClicked').as(
      'handleAddClickedSpy'
    );

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('equipment')).to.not.be
            .null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.get('[data-cy="selector-closePopup"]').should('exist');
          cy.get('[data-cy="selector-closePopup"]').click();

          cy.get('@handleAddClickedSpy').should('be.calledOnce');
          cy.get('@populateSpy').should('not.be.called');

          expect(farmosUtil.getFromGlobalVariableCache('equipment')).to.not.be
            .null;
        });
    });
  });
});
