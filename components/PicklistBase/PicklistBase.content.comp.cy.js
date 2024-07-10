import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the default PicklistBase content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the default data-cy elements', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should('exist');
        cy.get('[data-cy="picklist-header-name"]').should('exist');
        cy.get('[data-cy="picklist-header-quantity"]').should('exist');
        cy.get('[data-cy="picklist-header-location"]').should('exist');
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
        cy.get('[data-cy="picklist-sort-button-name"]').should('exist');
        cy.get('[data-cy="picklist-sort-button-quantity"]').should('exist');
        cy.get('[data-cy="picklist-sort-button-location"]').should('exist');
      });
  });

  it('Check that props are passed through to the PicklistBase', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0, 0],
        units: 'Trays',
        quantityAttribute: 'quantity',
        showValidityStyling: true,
        invalidFeedbackText: 'Please pick at least one item.',
        showInfoIcons: true,
        required: true, // Ensuring required is true to trigger invalid state
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should('exist');
        cy.get('[data-cy="picklist-row-0"]').should('exist');
        cy.get('[data-cy="picklist-row-1"]').should('exist');
        cy.get('[data-cy="picklist-invalid-feedback"]').should(
          'have.text',
          'Please pick at least one item.'
        );
        cy.get('[data-cy="picklist-units-button"]')
          .should('exist')
          .and('have.text', 'Trays');
      });
  });

  it('Check if all button is visible when allButtonVisible is true and units is null', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [],
        showAllButton: true,
        units: null,
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-all-button"]').should('exist');
      });
  });

  it('Check if info icons are displayed when showInfoIcons is true', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [1, 2],
        showInfoIcons: true,
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-info-icon-0"]').should('exist');
        cy.get('[data-cy="picklist-info-icon-1"]').should('exist');
      });
  });

  it('Check if checkboxes are displayed when units is null', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [1, 2],
        units: null,
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-checkbox-0"]').should('exist');
        cy.get('[data-cy="picklist-checkbox-1"]').should('exist');
      });
  });

  it('Check if select dropdowns are displayed when units is not null', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [1, 2],
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-quantity-0"]').should('exist');
        cy.get('[data-cy="picklist-quantity-0-0"]').should('exist');
        cy.get('[data-cy="picklist-quantity-0-1"]').should('exist');

        cy.get('[data-cy="picklist-quantity-1"]').should('exist');
        cy.get('[data-cy="picklist-quantity-1-0"]').should('exist');
        cy.get('[data-cy="picklist-quantity-1-1"]').should('exist');
        cy.get('[data-cy="picklist-quantity-1-2"]').should('exist');
      });
  });

  it('Check info card elements', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          {
            name: 'Item A',
            quantity: 1,
            location: 'GHANA',
            stuff: 'First Item',
          },
          {
            name: 'Item B',
            quantity: 2,
            location: 'GHANA',
            stuff: 'Second Item',
          },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: {
          name: 'Name',
          quantity: 'Quantity',
          location: 'Location',
          stuff: 'More Info',
        },
        picked: [1, 2],
        showInfoIcons: true,
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-info-0"]');
        cy.get('[data-cy="picklist-info-icon-0"]').click({ force: true });
        cy.get('[data-cy="picklist-info-overlay"]').should('exist');
        cy.get('[data-cy="picklist-info-card"]').should('exist');
        cy.get('[data-cy="picklist-info-card-header"]').should('exist');
        cy.get('[data-cy="picklist-info-card-body"]').should('exist');
        cy.get('[data-cy="picklist-info-more-info-0"]')
          .should('exist')
          .and('contain.text', 'More Info: First Item');

        cy.get('[data-cy="picklist-info-0"]');
        cy.get('[data-cy="picklist-info-icon-1"]').click({ force: true });
        cy.get('[data-cy="picklist-info-overlay"]').should('exist');
        cy.get('[data-cy="picklist-info-card"]').should('exist');
        cy.get('[data-cy="picklist-info-card-header"]').should('exist');
        cy.get('[data-cy="picklist-info-card-body"]').should('exist');
        cy.get('[data-cy="picklist-info-more-info-1"]')
          .should('exist')
          .and('contain.text', 'More Info: Second Item');
      });
  });
});
