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

  it('1) required=false, requiredRow=false, no beds, no plants', () => {
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

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('not.have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('2) required=false, requiredRow=false, empty bed, no plants', () => {
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

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('3) required=false, requiredRow=false, bed with plants', () => {
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

    // pick first row which also picks ALF-1
    cy.get('[data-cy="picklist-checkbox-0"]').click();

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('4) required=true, requiredRow=false, no beds, no plants', () => {
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

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('not.have.class', 'is-valid')
          .and('have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('5) required=true, requiredRow=false, empty bed', () => {
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

    // pick ALF-4 bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).click();

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('6) required=true, requiredRow=false, bed with plants', () => {
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

    // pick first row which also picks ALF-1
    cy.get('[data-cy="picklist-checkbox-0"]').click();

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });

  it('7) required=true, requiredRow=true, no beds, no plants', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
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
          .and('have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('be.visible');
  });

  it('8) required=true, requiredRow=true, empty bed', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick ALF-4 bed
    cy.get(
      '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
    ).click();

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('not.have.class', 'is-valid')
      .and('have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('be.visible');
  });

  it('9) required=true, requiredRow=true, bed with plants', () => {
    const readySpy = cy.spy().as('readySpy');
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: true,
        showValidityStyling: true,
        onReady: readySpy,
      },
    });
    cy.get('@readySpy').should('have.been.calledOnce');

    // pick first row which also picks ALF-1
    cy.get('[data-cy="picklist-checkbox-0"]').click();

    cy.get('[data-cy="picker-options"] input[name="picker-options"]').each(
      ($cb) => {
        cy.wrap($cb)
          .should('have.class', 'is-valid')
          .and('not.have.class', 'is-invalid');
      }
    );
    cy.get('[data-cy="picker-invalid-feedback"]').should('not.be.visible');

    cy.get('[data-cy="picklist-table"]')
      .should('have.class', 'is-valid')
      .and('not.have.class', 'is-invalid');
    cy.get('[data-cy="picklist-invalid-feedback"]').should('not.exist');
  });
});
