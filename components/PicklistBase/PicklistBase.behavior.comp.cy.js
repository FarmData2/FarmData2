import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the PicklistBase component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('emits ready event once initialized', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        onReady: readySpy,
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0, 0],
      },
    });

    cy.get('@readySpy').should('have.been.calledOnce');
  });

  it('selects/deselects all rows using "All" button', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0, 0],
      },
    });

    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');

    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-checkbox-0"]').should('not.be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('not.be.checked');

    cy.get('[data-cy="picklist-all-button"]').click();
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');
  });

  it('selects/deselects all rows using "Units" button when units are set', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [0, 0],
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-units-button"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '5');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '3');

    cy.get('[data-cy="picklist-units-button"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '0');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '0');
  });

  it('sorts rows correctly and updates picked rows and quantities', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [2, 3],
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '3');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '2');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item B');
    cy.get('[data-cy="picklist-row-1"]').contains('Item A');
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '2');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '3');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '3');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '2');
  });

  it('displays info overlay correctly', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          {
            name: 'Item 1',
            quantity: 5,
            location: 'GHANA',
            description: 'Description 1',
          },
          {
            name: 'Item 2',
            quantity: 3,
            location: 'GHANA',
            description: 'Description 2',
          },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: {
          name: 'Name',
          quantity: 'Quantity',
          location: 'Location',
          description: 'Description',
        },
        picked: [0, 0],
        showInfoIcons: true,
      },
    });

    cy.get('[data-cy="picklist-info-icon-0"]').click({ force: true });
    cy.get('[data-cy="picklist-info-card-body"]').contains(
      'Description: Description 1'
    );

    cy.get('[data-cy="picklist-info-icon-1"]').click({ force: true });
    cy.get('[data-cy="picklist-info-card-body"]').contains(
      'Description: Description 2'
    );
  });

  it('displays new data in the correct order when loaded with sorting applied', () => {
    // Initial mounting of the component with first set of data
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: [2, 4],
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    // Apply initial sort by name in ascending order
    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');

    // Update the props to load new data
    cy.wrap({
      updateProps: (props) => {
        Cypress.vueWrapper.setProps(props);
      },
    }).invoke('updateProps', {
      rows: [
        { name: 'Item D', quantity: 1, location: 'GHANA' },
        { name: 'Item C', quantity: 6, location: 'GHANA' },
      ],
      picked: [1, 6],
    });

    // Verify the new data is sorted correctly in ascending order by name
    cy.get('[data-cy="picklist-row-0"]').contains('Item C');
    cy.get('[data-cy="picklist-row-1"]').contains('Item D');
  });
});
