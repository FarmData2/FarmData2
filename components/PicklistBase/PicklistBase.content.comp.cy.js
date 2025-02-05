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
        cy.get('[data-cy="picklist-sort-button-name"]')
          .should('exist')
          .and('contain.text', 'Name');
        cy.get('[data-cy="picklist-sort-button-quantity"]')
          .should('exist')
          .and('contain.text', 'Quantity');
        cy.get('[data-cy="picklist-sort-button-location"]')
          .should('exist')
          .and('contain.text', 'Location');
      });
  });

  it('Check that props are passed through to the PicklistBase', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item A', quantity: 5, location: 'GHANA' },
          { name: 'Item B', quantity: 7, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
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

        // Check row 0
        cy.get('[data-cy="picklist-row-0"]').should('exist');
        cy.get('select[data-cy="picklist-quantity-0"]').should(
          'have.value',
          '0'
        );
        cy.get('td[data-cy="picklist-name-0"]').should('have.text', 'Item A');
        cy.get('td[data-cy="picklist-quantity-0"]').should('have.text', '5');
        cy.get('td[data-cy="picklist-location-0"]').should(
          'have.text',
          'GHANA'
        );

        // Check row 1
        cy.get('[data-cy="picklist-row-1"]').should('exist');
        cy.get('select[data-cy="picklist-quantity-1"]').should(
          'have.value',
          '0'
        );
        cy.get('td[data-cy="picklist-name-1"]').should('have.text', 'Item B');
        cy.get('td[data-cy="picklist-quantity-1"]').should('have.text', '7');
        cy.get('td[data-cy="picklist-location-1"]').should(
          'have.text',
          'GHANA'
        );

        cy.get('[data-cy="picklist-invalid-feedback"]').should(
          'have.text',
          'Please pick at least one item.'
        );
        cy.get('[data-cy="picklist-units-button"]')
          .should('exist')
          .and('have.text', '✅ Trays');
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
        picked: new Map(),
        showAllButton: true,
        units: null,
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-all-button"]')
          .should('exist')
          .and('have.text', '✅ All');
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
        picked: new Map([
          [0, { picked: 1 }],
          [1, { picked: 2 }],
        ]),
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
        picked: new Map([
          [0, { picked: 1 }],
          [1, { picked: 2 }],
        ]),
        units: null, // Checkbox mode
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
          { name: 'Item A', quantity: 3, location: 'GHANA' },
          { name: 'Item B', quantity: 5, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 1 }],
          [1, { picked: 2 }],
        ]),
        units: 'Trays', // Dropdown mode
        quantityAttribute: 'quantity',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('select[data-cy="picklist-quantity-0"]')
          .should('exist')
          .and('have.value', '1');
        cy.get('option[data-cy="picklist-quantity-0-0"]').should('exist');
        cy.get('option[data-cy="picklist-quantity-0-2"]').should('exist');

        cy.get('select[data-cy="picklist-quantity-1"]')
          .should('exist')
          .and('have.value', '2');
        cy.get('option[data-cy="picklist-quantity-1-0"]').should('exist');
        cy.get('option[data-cy="picklist-quantity-1-4"]').should('exist');
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
        picked: new Map([
          [0, { picked: 1 }],
          [1, { picked: 2 }],
        ]),
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
