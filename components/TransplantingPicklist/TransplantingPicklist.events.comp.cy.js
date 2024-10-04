import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

describe('Test the TransplantingPicklist component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "valid" when created', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').its('callCount').should('equal', 1);
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Emits "valid" true when crop and trays are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('@validSpy').its('callCount').should('equal', 1);
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picklist-quantity-0"]').select('1');
        cy.get('@validSpy').its('callCount').should('equal', 2);
        // First call, first argument.
        cy.get('@validSpy').its('args[0][0]').should('equal', false);
        // Second call, first argument.
        cy.get('@validSpy').its('args[1][0]').should('equal', true);
      });
  });

  it('Emits "valid" false when trays are deselected', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('[data-cy="picklist-quantity-0"]').select('1');
        cy.get('@validSpy').its('callCount').should('equal', 2);
        cy.get('@validSpy').its('args[0][0]').should('equal', false);
        cy.get('@validSpy').its('args[1][0]').should('equal', true);

        cy.get('[data-cy="picklist-quantity-0"]').select('0');
        cy.get('@validSpy').its('callCount').should('equal', 3);
        cy.get('@validSpy').its('args[2][0]').should('equal', false);
      });
  });

  it('Emits "update:crop" when the crop filter is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:crop': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('@updateSpy').its('callCount').should('equal', 2);
        cy.get('@updateSpy').should('have.been.calledWith', 'BROCCOLI');

        cy.get('[data-cy="selector-input"]').select('ZUCCHINI');
        cy.get('@updateSpy').its('callCount').should('equal', 3);
        cy.get('@updateSpy').should('have.been.calledWith', 'ZUCCHINI');
      });
  });

  it('Emits "update:picked" when created', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Called twice on creation
        cy.get('@updateSpy').its('callCount').should('equal', 2);
        cy.get('@updateSpy').its('args[0][0].size').should('equal', 0);
        cy.get('@updateSpy').its('args[1][0].size').should('equal', 0);
      });
  });

  it('Emits "update:picked" when trays are selected.', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('@updateSpy').its('callCount').should('equal', 3);

        cy.get('[data-cy="picklist-quantity-0"]').select('1');
        cy.get('@updateSpy').its('callCount').should('equal', 4);

        cy.get('@updateSpy').its('args[0][0].size').should('equal', 0);
        cy.get('@updateSpy').its('args[1][0].size').should('equal', 0);
        cy.get('@updateSpy').its('args[2][0].size').should('equal', 0);
        cy.get('@updateSpy').its('args[3][0].size').should('equal', 1);

        cy.get('@updateSpy')
          .its('args[3][0]')
          .should((pickedMap) => {
            expect(pickedMap).to.be.instanceOf(Map);
            expect(pickedMap.size).to.equal(1);

            const pickedRow = pickedMap.get(0);
            expect(pickedRow).to.have.property('trays', 1);
            expect(pickedRow.data).to.have.property('crop', 'BROCCOLI');
          });
      });
  });

  it('Emits "update:picked" with multiple rows.', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('[data-cy="picklist-quantity-0"]').select('1');
        cy.get('[data-cy="picklist-quantity-1"]').select('2');

        cy.get('@updateSpy').its('callCount').should('equal', 5);

        cy.get('@updateSpy')
          .its('args[4][0]')
          .should((pickedMap) => {
            expect(pickedMap).to.be.instanceOf(Map);
            expect(pickedMap.size).to.equal(2);

            const firstRow = pickedMap.get(0);
            expect(firstRow).to.have.property('trays', 1);
            expect(firstRow.data).to.have.property('crop', 'BROCCOLI');

            const secondRow = pickedMap.get(1);
            expect(secondRow).to.have.property('trays', 2);
            expect(secondRow.data).to.have.property('crop', 'BROCCOLI');
          });
      });
  });

  it('Emits "update:picked" when trays are deselected', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
        required: true,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('[data-cy="picklist-quantity-0"]').select('1');
        cy.get('@updateSpy').its('callCount').should('equal', 4);

        cy.get('[data-cy="picklist-quantity-0"]').select('0');
        cy.get('@updateSpy').its('callCount').should('equal', 5);
        cy.get('@updateSpy').its('args[4][0].size').should('equal', 0);
      });
  });
});
