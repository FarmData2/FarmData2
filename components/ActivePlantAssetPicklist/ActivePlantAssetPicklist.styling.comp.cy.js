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
   * In each scenario:
   *   rowPicked:           has the user manually checked at least one row in the PicklistBase?
   *   bedPicked:           has the user manually checked at least one bed in the BedPicker?
   *   required:            is the component configured to require at least one row selection?
   *   showValidityStyling: is validity styling (red/green outlines + feedback) turned on?
   *
   * rowPicked | bedPicked | required | showValidityStyling | Scenario description
   * ----------------------------------------------------------------------------------
   * false     | false     | false    | false               | 1.  No row picked, no bed picked, not required, styling off
   * false     | false     | false    | true                | 2.  No row picked, no bed picked, not required, styling on
   * false     | false     | true     | false               | 3.  No row picked, no bed picked, required, styling off
   * false     | false     | true     | true                | 4.  No row picked, no bed picked, required, styling on
   * false     | true      | false    | false               | 5.  No row picked, bed picked,    not required, styling off
   * false     | true      | false    | true                | 6.  No row picked, bed picked,    not required, styling on
   * false     | true      | true     | false               | 7.  No row picked, bed picked,    required, styling off
   * false     | true      | true     | true                | 8.  No row picked, bed picked,    required, styling on
   * true      | false     | false    | false               | 9.  Row picked,   no bed picked,  not required, styling off
   * true      | false     | false    | true                | 10. Row picked,   no bed picked,  not required, styling on
   * true      | false     | true     | false               | 11. Row picked,   no bed picked,  required, styling off
   * true      | false     | true     | true                | 12. Row picked,   no bed picked,  required, styling on
   * true      | true      | false    | false               | 13. Row picked,   bed picked,     not required, styling off
   * true      | true      | false    | true                | 14. Row picked,   bed picked,     not required, styling on
   * true      | true      | true     | false               | 15. Row picked,   bed picked,     required, styling off
   * true      | true      | true     | true                | 16. Row picked,   bed picked,     required, styling on
   *
   * And because BedPicker can list beds that don’t actually have any rows in PicklistBase,
   * we add four more to cover “ALF-4 only”:
   *
   *   bedPicked = ALF-4 (picker-only), rowPicked = false
   *
   * required | showValidityStyling | Scenario description
   * -----------------------------------------------------
   * false    | false               | 17. No row, ALF-4 bed picked, not required, styling off
   * false    | true                | 18. No row, ALF-4 bed picked, not required, styling on
   * true     | false               | 19. No row, ALF-4 bed picked, required, styling off
   * true     | true                | 20. No row, ALF-4 bed picked, required, styling on
   */

  it('1. No row picked, no bed picked, not required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('2. No row picked, no bed picked, not required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // BedPicker should be invalid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'have.class',
      'd-block'
    );

    // PicklistBase always valid when not required
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('3. No row picked, no bed picked, required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('4. No row picked, no bed picked, required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // BedPicker should be invalid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'have.class',
      'd-block'
    );

    // PicklistBase should be invalid
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]')
      .should('exist')
      .and('have.text', 'At least one row must be selected.');
  });

  it('5. No row picked, bed picked, not required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
    ).check();

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('6. No row picked, bed picked, not required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
    ).check();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase always valid when not required
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('7. No row picked, bed picked, required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
    ).check();

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('8. No row picked, bed picked, required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
    ).check();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should be valid via sync
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('9. Row picked, no bed picked, not required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('10. Row picked, no bed picked, not required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');

    // BedPicker should be valid via sync
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase always valid when not required
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('11. Row picked, no bed picked, required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('12. Row picked, no bed picked, required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');

    // BedPicker should be valid via sync
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should be valid
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('13. Row picked, bed picked, not required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row and a bed
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('14. Row picked, bed picked, not required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row and a bed
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase always valid when not required
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('15. Row picked, bed picked, required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row and a bed
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should have no validity classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('16. Row picked, bed picked, required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a row and a bed
    cy.get('[data-cy="picklist-checkbox-0"]')
      .invoke('click')
      .should('be.checked');
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should be valid
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  //------------------------ For beds that only exist in bedPicker -------------------------------//

  it('17. No row picked, ALF-4 bed picked, not required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick a bed that has no rows in the picklist
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should have no validity classes
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should be completely untouched (no rows selected, no styling)
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('18. No row picked, ALF-4 bed picked, not required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick ALF-4 bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase remains valid (not required)
    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('19. No row picked, ALF-4 bed picked, required, styling off', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: false,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick ALF-4 bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should have no validity classes (styling off)
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('not.have.class', 'is-invalid')
          .and('not.have.class', 'is-valid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase remains invalid? No—since styling off, still no classes
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('20. No row picked, ALF-4 bed picked, required, styling on', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick ALF-4 bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).check();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) =>
        cy
          .wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid')
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should now be invalid (required & no rows)
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]')
      .should('exist')
      .and('have.text', 'At least one row must be selected.');
  });
});
