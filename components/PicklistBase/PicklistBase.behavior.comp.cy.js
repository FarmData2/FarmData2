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

  it('selects/deselects all rows using "All" button', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
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
        picked: new Map(),
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

  it('sorts alphabetical data correctly', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
          { name: 'Item C', quantity: 6, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
      },
    });

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-name-0"]').should('have.text', 'Item A');
    cy.get('[data-cy="picklist-name-1"]').should('have.text', 'Item B');
    cy.get('[data-cy="picklist-name-2"]').should('have.text', 'Item C');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-name-0"]').should('have.text', 'Item C');
    cy.get('[data-cy="picklist-name-1"]').should('have.text', 'Item B');
    cy.get('[data-cy="picklist-name-2"]').should('have.text', 'Item A');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-name-0"]').should('have.text', 'Item A');
    cy.get('[data-cy="picklist-name-1"]').should('have.text', 'Item B');
    cy.get('[data-cy="picklist-name-2"]').should('have.text', 'Item C');
  });

  it('sorts numeric data correctly', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 10, location: 'GHANA' },
          { name: 'Item C', quantity: 3, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
      },
    });

    cy.get('[data-cy="picklist-sort-button-quantity"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.text', '2');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.text', '3');
    cy.get('[data-cy="picklist-quantity-2"]').should('have.text', '10');

    cy.get('[data-cy="picklist-sort-button-quantity"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.text', '10');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.text', '3');
    cy.get('[data-cy="picklist-quantity-2"]').should('have.text', '2');

    cy.get('[data-cy="picklist-sort-button-quantity"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.text', '2');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.text', '3');
    cy.get('[data-cy="picklist-quantity-2"]').should('have.text', '10');
  });

  it('sorts mixed type data correctly', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'A' },
          { name: 'Item A', quantity: 10, location: 2 },
          { name: 'Item C', quantity: 3, location: 'B' },
          { name: 'Item C', quantity: 3, location: 10 },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
      },
    });

    cy.get('[data-cy="picklist-sort-button-location"]').click();
    cy.get('[data-cy="picklist-location-0"]').should('have.text', '2');
    cy.get('[data-cy="picklist-location-1"]').should('have.text', '10');
    cy.get('[data-cy="picklist-location-2"]').should('have.text', 'A');
    cy.get('[data-cy="picklist-location-3"]').should('have.text', 'B');

    cy.get('[data-cy="picklist-sort-button-location"]').click();
    cy.get('[data-cy="picklist-location-0"]').should('have.text', 'B');
    cy.get('[data-cy="picklist-location-1"]').should('have.text', 'A');
    cy.get('[data-cy="picklist-location-2"]').should('have.text', '10');
    cy.get('[data-cy="picklist-location-3"]').should('have.text', '2');

    cy.get('[data-cy="picklist-sort-button-location"]').click();
    cy.get('[data-cy="picklist-location-0"]').should('have.text', '2');
    cy.get('[data-cy="picklist-location-1"]').should('have.text', '10');
    cy.get('[data-cy="picklist-location-2"]').should('have.text', 'A');
    cy.get('[data-cy="picklist-location-3"]').should('have.text', 'B');
  });

  it('selected quantities move with sorted data', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 2 }],
          [1, { picked: 3 }],
        ]),
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '3');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '2');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '2');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '3');

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '3');
    cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '2');
  });

  it('checks sort order is preserved across data change', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item B', quantity: 2, location: 'GHANA' },
          { name: 'Item A', quantity: 4, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map([
          [0, { picked: 2 }],
          [1, { picked: 4 }],
        ]),
        units: 'Trays',
        quantityAttribute: 'quantity',
      },
    });

    cy.get('[data-cy="picklist-sort-button-name"]').click();
    cy.get('[data-cy="picklist-row-0"]').contains('Item A');
    cy.get('[data-cy="picklist-row-1"]').contains('Item B');

    cy.wrap({
      updateProps: (props) => {
        Cypress.vueWrapper.setProps(props);
      },
    }).invoke('updateProps', {
      rows: [
        { name: 'Item D', quantity: 1, location: 'GHANA' },
        { name: 'Item C', quantity: 6, location: 'GHANA' },
      ],
      picked: new Map([
        [0, { picked: 1 }],
        [1, { picked: 6 }],
      ]),
    });

    cy.get('[data-cy="picklist-row-0"]').contains('Item C');
    cy.get('[data-cy="picklist-row-1"]').contains('Item D');
  });

  it('shows multiple info cards in sequence', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA', notes: 'Note 1' },
          { name: 'Item 2', quantity: 3, location: 'KENYA', notes: 'Note 2' },
        ],
        columns: ['name', 'quantity'],
        labels: {
          name: 'Name',
          quantity: 'Quantity',
          location: 'Location',
          notes: 'Notes',
        },
        picked: new Map(),
        showInfoIcons: true,
      },
    });

    cy.get('[data-cy="picklist-info-icon-0"]').click({ multiple: true });
    cy.get('[data-cy="picklist-info-notes-0"]').should('contain', 'Note 1');

    cy.get('[data-cy="picklist-info-icon-1"]').click({ multiple: true });
    cy.get('[data-cy="picklist-info-notes-1"]').should('contain', 'Note 2');
    cy.get('[data-cy="picklist-info-notes-0"]').should('not.exist');
  });

  it('disables selection controls when info overlay is shown', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA', notes: 'Note 1' },
          { name: 'Item 2', quantity: 3, location: 'KENYA', notes: 'Note 2' },
        ],
        columns: ['name', 'quantity'],
        labels: {
          name: 'Name',
          quantity: 'Quantity',
          location: 'Location',
          notes: 'Notes',
        },
        picked: new Map(),
        showInfoIcons: true,
      },
    });

    cy.get('[data-cy="picklist-info-icon-0"]').click({ multiple: true });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.disabled');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.disabled');
    cy.get('[data-cy="picklist-all-button"]').should('be.disabled');
  });

  it('maintains all/none selection state through overlay toggle', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'KENYA' },
        ],
        columns: ['name', 'quantity'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showInfoIcons: true,
      },
    });

    cy.get('[data-cy="picklist-all-button"]').click({ multiple: true });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');

    cy.get('[data-cy="picklist-info-icon-0"]').click({ multiple: true });
    cy.get('[data-cy="picklist-info-overlay"]').click({
      force: true,
      multiple: true,
    });

    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '🚫 All');
  });

  it('toggles selection when clicking individual checkboxes with overlay closed', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'KENYA' },
        ],
        columns: ['name', 'quantity'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showInfoIcons: true,
      },
    });

    cy.get('[data-cy="picklist-checkbox-0"]').click({ multiple: true });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('not.be.checked');
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '✅ All');

    cy.get('[data-cy="picklist-checkbox-1"]').click({ multiple: true });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '🚫 All');
  });

  it('preserves all button state through prop updates', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'KENYA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
      },
    });

    cy.get('[data-cy="picklist-all-button"]').click();

    cy.wrap({
      updateProps: (props) => {
        Cypress.vueWrapper.setProps(props);
      },
    }).invoke('updateProps', {
      rows: [
        { name: 'Item 1', quantity: 6, location: 'GHANA' },
        { name: 'Item 2', quantity: 4, location: 'KENYA' },
      ],
    });

    cy.get('[data-cy="picklist-checkbox-0"]').should('be.checked');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.checked');
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '🚫 All');
  });

  it('updates all button state correctly with partial selection', () => {
    cy.mount(PicklistBase, {
      props: {
        rows: [
          { name: 'Item 1', quantity: 5, location: 'GHANA' },
          { name: 'Item 2', quantity: 3, location: 'GHANA' },
          { name: 'Item 3', quantity: 4, location: 'KENYA' },
        ],
        columns: ['name', 'quantity'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        showInfoIcons: true,
      },
    });

    cy.get('[data-cy="picklist-checkbox-0"]').click({ multiple: true });
    cy.get('[data-cy="picklist-checkbox-1"]').click({ multiple: true });
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '✅ All');

    cy.get('[data-cy="picklist-checkbox-2"]').click({ multiple: true });
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '🚫 All');

    cy.get('[data-cy="picklist-checkbox-1"]').click({ multiple: true });
    cy.get('[data-cy="picklist-all-button"]')
      .find('span')
      .should('contain', '✅ All');
  });
});
