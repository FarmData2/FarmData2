import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('Test the default ActivePlantAssetPicklist content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Checks all of the data-cy elements and default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="active-plant-asset-picklist"]').should('exist');

        cy.get('[data-cy="picklist-table"]').should('exist');
        cy.get('[data-cy="picklist-all-button"]').should('not.exist');
        cy.get('[data-cy="picklist-units-button"]').should('not.exist');
        cy.get('[data-cy="picklist-header-crop"]').should('be.visible');
        cy.get('[data-cy="picklist-header-bed"]').should('be.visible');
        cy.get('[data-cy="picklist-header-planted-date"]').should('be.visible');

        cy.get('[data-cy="picklist-row-0"]').should('not.exist');
      });
  });

  it('Checks active plant assets are fetched (isInGround = true, isInTrays = false)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        isInGround: true,
        location: 'CHUAU',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy^="picklist-crop-"]')
          .its('length')
          .then((count) => {
            expect(count).to.equal(8);
          });

        cy.get('[data-cy="picklist-crop-0"]').should(
          'have.text',
          'HERB-CILANTRO'
        );
        cy.get('[data-cy="picklist-crop-7"]').should(
          'have.text',
          'LETTUCE-ICEBERG'
        );
      });

    // ensure all column exist
    cy.get('[data-cy="picklist-header-crop"]').should('be.visible');
    cy.get('[data-cy="picklist-header-bed"]').should('be.visible');
    cy.get('[data-cy="picklist-header-planted-date"]').should('be.visible');
  });

  it('Checks active plant assets are fetched (isInGround = false, isInTrays = true)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        isInGround: false,
        isInTrays: true,
        location: 'CHUAU',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy^="picklist-crop-"]')
          .its('length')
          .then((count) => {
            expect(count).to.equal(12);
          });

        cy.get('[data-cy="picklist-crop-0"]').should('have.text', 'BROCCOLI');
        cy.get('[data-cy="picklist-crop-11"]').should(
          'have.text',
          'CAULIFLOWER'
        );

        // ensure that there is no bed column if all fetched assets have no beds
        cy.get('[data-cy="picklist-header-crop"]').should('be.visible');
        cy.get('[data-cy="picklist-header-bed"]').should('not.exist');
        cy.get('[data-cy="picklist-header-planted-date"]').should('be.visible');
      });
  });

  it('Checks active plant assets are fetched (isInGround = true, isInTrays = true)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        isInGround: true,
        isInTrays: true,
        location: 'CHUAU',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy^="picklist-crop-"]')
          .its('length')
          .then((count) => {
            expect(count).to.equal(20);
          });

        cy.get('[data-cy="picklist-crop-0"]').should('have.text', 'BROCCOLI');
        cy.get('[data-cy="picklist-crop-19"]').should(
          'have.text',
          'LETTUCE-ICEBERG'
        );

        // check assets with no beds
        cy.get('[data-cy="picklist-bed-0"]').should('have.text', 'N/A');
        cy.get('[data-cy="picklist-bed-10"]').should('have.text', 'N/A');

        // check assets with beds
        cy.get('[data-cy="picklist-bed-11"]').should('have.text', 'CHUAU-1');
        cy.get('[data-cy="picklist-bed-19"]').should('have.text', 'CHUAU-3');
      });
  });
});
