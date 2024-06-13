import EquipmentSelector from '@comps/EquipmentSelector/EquipmentSelector.vue';

describe('Test the default EquipmentSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check the first dropdown element', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="equipment-selector-1"]').should('exist');
        cy.get('[data-cy="equipment-selector-2"]').should('not.exist');
      });
  });

  it('Check default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-required"]').should('not.exist');
        cy.get('[data-cy="selector-label"]').should('have.text', '1:');
        cy.get('[data-cy="selector-input"]').should('have.value', null);
        cy.get('[data-cy="selector-delete-button"]').should('not.exist');
        cy.get('[data-cy="selector-add-button"]').should('exist');
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="selector-input"]').should(
          'not.have.class',
          'is-invalid'
        );
      });
  });

  it('Check optional/non-default prop values', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        required: true,
        selected: ['Tractor'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="equipment-selector-1"]').should('exist');
        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('not.exist');

        cy.get('[data-cy="equipment-selector-2"]').should('exist');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-required"]')
          .should('exist');
        cy.get('[data-cy="equipment-selector-2"]')
          .find('[data-cy="selector-required"]')
          .should('not.exist');

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'Tractor');
      });
  });

  it('Check showValidityStyling prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
        required: true,
        showValidityStyling: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.class', 'is-invalid');
      });
  });

  it('Check contents of the equipment selector dropdown', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(EquipmentSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]')
          .find('option')
          .should('have.length', 9);

        cy.get('[data-cy="equipment-selector-1"]')
          .find('[data-cy="selector-option-1"]')
          .should('have.value', 'General');
      });
  });
});
