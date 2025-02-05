import PicklistBase from '@comps/PicklistBase/PicklistBase.vue';

describe('Test the PicklistBase component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * There are 8 possibilities for styling...
   *
   * required   showValidityStyling    picked     Tested by Test
   * false      false                  true       1. Not Required, Not showing, picked
   * false      false                  false      2. Not Required, Not showing, not picked
   * false      true                   true       3. Not Required, Showing, picked
   * false      true                   false      4. Not Required, Showing, not picked
   * true       false                  true       5. Required, Not showing, picked
   * true       false                  false      6. Required, Not showing, not picked
   * true       true                   true       7. Required, Showing, picked
   * true       true                   false      8. Required, Showing, not picked
   */

  it('1. Not Required, Not showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: false,
        showValidityStyling: false,
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
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('2. Not Required, Not showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: false,
        showValidityStyling: false,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(), // No selections
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('3. Not Required, Showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: false,
        showValidityStyling: true,
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
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('4. Not Required, Showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: false,
        showValidityStyling: true,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('5. Required, Not showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: true,
        showValidityStyling: false,
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
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('6. Required, Not showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: true,
        showValidityStyling: false,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('7. Required, Showing, picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: true,
        showValidityStyling: true,
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
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-valid');
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-invalid'
        );
        cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
      });
  });

  it('8. Required, Showing, not picked', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(PicklistBase, {
      props: {
        required: true,
        showValidityStyling: true,
        rows: [
          { name: 'Item A', quantity: 1, location: 'GHANA' },
          { name: 'Item B', quantity: 2, location: 'GHANA' },
        ],
        columns: ['name', 'quantity', 'location'],
        labels: { name: 'Name', quantity: 'Quantity', location: 'Location' },
        picked: new Map(),
        units: 'Trays',
        quantityAttribute: 'quantity',
        onReady: readySpy,
        invalidFeedbackText: 'Select at least one tray to transplant.',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-table"]').should(
          'not.have.class',
          'is-valid'
        );
        cy.get('[data-cy="picklist-table"]').should('have.class', 'is-invalid');
        cy.get('[data-cy="picklist-invalid-feedback"]').should('exist');
        cy.get('[data-cy="picklist-invalid-feedback"]').should('be.visible');
        cy.get('[data-cy="picklist-invalid-feedback"]').should(
          'have.text',
          'Select at least one tray to transplant.'
        );
      });
  });
});
