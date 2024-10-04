import TransplantingPicklist from '@comps/TransplantingPicklist/TransplantingPicklist.vue';

describe('Test the TransplantingPicklist component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Info icons should be visible', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picklist-info-icon-0"]').should('not.exist');

        cy.get('[data-cy="selector-input"]').select('BROCCOLI');

        cy.get('[data-cy="picklist-info-icon-0"]').should('exist');
        cy.get('[data-cy="picklist-info-icon-4"]').should('exist');
      });
  });

  it('Clicking info icons shows popup and data', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('[data-cy="picklist-info-overlay"]').should('not.exist');

        cy.get('[data-cy="picklist-info-icon-0"]').click();
        cy.get('[data-cy="picklist-info-overlay"]').should('exist');

        cy.get('[data-cy="picklist-info-user-0"]').should(
          'have.text',
          'User: admin'
        );
        cy.get('[data-cy="picklist-info-tray-size-0"]').should(
          'have.text',
          'Tray Size: 128'
        );
        cy.get('[data-cy="picklist-info-seeds/cell-0"]').should(
          'have.text',
          'Seeds/Cell: 1'
        );
        cy.get('[data-cy="picklist-info-total-seeds-0"]').should(
          'have.text',
          'Total Seeds: 512'
        );
        cy.get('[data-cy="picklist-info-notes-0"]').should(
          'have.text',
          'Notes: First broccoli tray seeding.'
        );
      });
  });

  it('Units button selects max trays in each row', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '0');
        cy.get('[data-cy="picklist-quantity-4"]').should('have.value', '0');

        cy.get('[data-cy="picklist-units-button"]').click();
        cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '4');
        cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '4');
        cy.get('[data-cy="picklist-quantity-2"]').should('have.value', '9');
        cy.get('[data-cy="picklist-quantity-3"]').should('have.value', '13');
        cy.get('[data-cy="picklist-quantity-4"]').should('have.value', '2');
      });
  });

  it('Units button clears trays in all rows', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('BROCCOLI');
        cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '0');
        cy.get('[data-cy="picklist-units-button"]').click();
        cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '4');

        cy.get('[data-cy="picklist-units-button"]').click();
        cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '0');
        cy.get('[data-cy="picklist-quantity-1"]').should('have.value', '0');
        cy.get('[data-cy="picklist-quantity-2"]').should('have.value', '0');
        cy.get('[data-cy="picklist-quantity-3"]').should('have.value', '0');
        cy.get('[data-cy="picklist-quantity-4"]').should('have.value', '0');
      });
  });

  it('Changing crop prop fetches new seedlings', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should('have.value', null);
          cy.get('[data-cy="picklist-quantity-0"]').should('not.exist');
        })
        .then(() => {
          wrapper.setProps({ crop: 'BROCCOLI' });

          cy.get('[data-cy="selector-input"]').should('have.value', null);
          cy.get('[data-cy="picklist-quantity-0"]').should('have.value', '0');
          cy.get('[data-cy="picklist-quantity-4"]').should('have.value', '0');
        });
    });
  });

  it('Emits "update:picked" when the crop prop is set', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should('have.value', null);
          cy.get('[data-cy="picklist-quantity-0"]').should('not.exist');

          cy.get('@updateSpy').its('callCount').should('equal', 2);
        })
        .then(() => {
          wrapper.setProps({ crop: 'BROCCOLI' });
          cy.get('@updateSpy').its('callCount').should('equal', 3);
          cy.get('@updateSpy').its('args[2][0].size').should('equal', 0);

          cy.get('[data-cy="selector-input"]').should('have.value', 'BROCCOLI');
        });
    });
  });

  it('Changing crop clears picked', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(TransplantingPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': updateSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').select('BROCCOLI');

          cy.get('[data-cy="picklist-units-button"]').click();
          cy.get('[data-cy="picklist-quantity-4"]').should('have.value', '2');
          cy.get('@updateSpy').its('callCount').should('equal', 4);
          cy.get('@updateSpy').its('args[3][0].size').should('equal', 5);
        })
        .then(() => {
          wrapper.setProps({ crop: 'ZUCCHINI' });
          cy.get('[data-cy="selector-input"]').should('have.value', 'ZUCCHINI');
          cy.get('@updateSpy').its('callCount').should('equal', 6);
          cy.get('@updateSpy').its('args[4][0].size').should('equal', 0);
          cy.get('@updateSpy').its('args[5][0].size').should('equal', 0);
        });
    });
  });
});
