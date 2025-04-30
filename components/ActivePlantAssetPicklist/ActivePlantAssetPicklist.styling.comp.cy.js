import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('Test the ActivePlantAssetPicklist component styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * There are 8 scenarios covering all combinations of:
   *
   *   rowPicked:            has the user manually picked at least one row in the PicklistBase?
   *   bedPicked:            has the user manually (or via sync) picked at least one bed in the BedPicker?
   *   showValidityStyling:  is the component currently showing validity feedback?
   *
   * rowPicked | bedPicked | showValidityStyling | Scenario description
   * ------------------------------------------------------------------------------
   * false     | false     | false               // 1. User hasn’t picked any rows or beds, styling off
   * false     | false     | true                // 2. Nothing picked, styling on (beds invalid)
   * false     | true      | false               // 3. Only beds picked, styling off
   * false     | true      | true                // 4. Beds picked, styling on (beds valid)
   * true      | false     | false               // 5. Only rows picked, styling off
   * true      | false     | true                // 6. Rows picked, styling on (beds invalid)
   * true      | true      | false               // 7. Rows and beds picked, styling off
   * true      | true      | true                // 8. Rows and beds picked, styling on (beds valid)
   */

  it('1. No row picked, no bed picked, not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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

  it('2. No row picked, no bed picked, showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'have.class',
          'd-block'
        );

        // Picklist Base
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

  it('3. No row picked, bed picked, not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Pick a bed
        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
        ).check();

        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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

  it('4. No row picked, bed picked, showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Pick a bed
        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
        ).check();

        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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

  it('5. Row picked, no bed picked, not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Pick a row
        cy.get('[data-cy="picklist-checkbox-1"]').check();

        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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

  it('6. Row picked, no bed picked, showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Pick a row
        cy.get('[data-cy="picklist-checkbox-1"]').check();

        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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

  it('7. Row picked, bed picked, not showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: false,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Pick a row
        cy.get('[data-cy="picklist-checkbox-1"]').check();

        // Pick a bed
        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
        ).check();

        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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

  it('8. Row picked, bed picked, showing', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        // Pick a row
        cy.get('[data-cy="picklist-checkbox-1"]').check();

        // Pick a bed
        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
        ).check();

        // Bed Picker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('not.have.class', 'is-invalid');
          }
        );
        cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
          ($cb) => {
            cy.wrap($cb).should('have.class', 'is-valid');
          }
        );
        cy.get('[data-cy="picker-invalid-feedback"]').should(
          'not.have.class',
          'd-block'
        );

        // Picklist Base
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
});
