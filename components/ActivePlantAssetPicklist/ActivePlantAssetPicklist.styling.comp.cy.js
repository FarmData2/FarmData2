import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('ActivePlantAssetPicklist styling', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('1) when required=false both controls valid', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        requiredRow: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb).and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should be valid
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('2) required=true + pick a row => both controls valid', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick first row
    cy.get('[data-cy="picklist-checkbox-0"]').click();

    // BedPicker should be valid via sync
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
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

  it('3) pick a bed not in picklist + requiredRow=false => both controls valid', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        requiredRow: false,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick ALF-4 bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).click();

    // BedPicker should be valid
    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
      'd-block'
    );

    // PicklistBase should be valid
    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('4) requiredRow=true + no picks => picklist invalid', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        requiredRow: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('not.have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should(
      'not.have.class',
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
});
