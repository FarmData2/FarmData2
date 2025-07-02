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
        cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
        cy.get('[data-cy="active-plant-asset-bed-picker"]').should('not.exist');

        cy.get('[data-cy="picklist-table"]').should('not.exist');
        cy.get('[data-cy="picklist-all-button"]').should('not.exist');
        cy.get('[data-cy="picklist-units-button"]').should('not.exist');
        cy.get('[data-cy="picklist-header-crop"]').should('not.exist');
        cy.get('[data-cy="picklist-header-bed"]').should('not.exist');
        cy.get('[data-cy="picklist-header-planted-date"]').should('not.exist');

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
        // check picklist base
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

    // check bedPicker
    cy.get('[data-cy="picker-options"] input[name="picker-options"]')
      .should('have.length', 5)
      .first()
      .should('have.value', 'CHUAU-1');
    cy.get('[data-cy="picker-options"] input[name="picker-options"]')
      .should('have.length', 5)
      .last()
      .should('have.value', 'CHUAU-5');

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

        // check bedPicker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]')
          .should('have.length', 5)
          .first()
          .should('have.value', 'CHUAU-1');
        cy.get('[data-cy="picker-options"] input[name="picker-options"]')
          .should('have.length', 5)
          .last()
          .should('have.value', 'CHUAU-5');

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

        // check bedPicker
        cy.get('[data-cy="picker-options"] input[name="picker-options"]')
          .should('have.length', 5)
          .first()
          .should('have.value', 'CHUAU-1');
        cy.get('[data-cy="picker-options"] input[name="picker-options"]')
          .should('have.length', 5)
          .last()
          .should('have.value', 'CHUAU-5');
      });
  });

  it('Shows Picklist but not BedPicker for "A"', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        isInGround: true,
        isInTrays: true,
        location: 'A',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy^="picklist-crop-"]')
          .its('length')
          .then((count) => {
            expect(count).to.equal(5);
          });

        cy.get('[data-cy="active-plant-asset-picklist"]').should('be.visible');
        cy.get('[data-cy="active-plant-asset-bed-picker"]').should('not.exist');
      });
  });

  it('Shows Picklist and BedPicker for "ALF', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        isInGround: true,
        isInTrays: true,
        location: 'ALF',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy^="picklist-crop-"]')
          .its('length')
          .then((count) => {
            expect(count).to.equal(3);
          });

        cy.get('[data-cy="active-plant-asset-picklist"]').should('exist');
        cy.get('[data-cy="active-plant-asset-bed-picker"]').should('exist');

        cy.get('[data-cy="picklist-crop-0"]').should(
          'have.text',
          'PEPPERS-BELL'
        );
        cy.get('[data-cy="picklist-crop-2"]').should(
          'have.text',
          'LETTUCE-ICEBERG'
        );

        cy.get('[data-cy="picklist-bed-0"]').should('exist');
        cy.get('[data-cy="picklist-bed-0"]').should('have.text', 'ALF-1');
        cy.get('[data-cy="picklist-bed-2"]').should('exist');
        cy.get('[data-cy="picklist-bed-2"]').should('have.text', 'ALF-2');
      });
  });

  it('Shows BedPicker but no Picklist for "H', () => {
    cy.mount(ActivePlantAssetPicklist, {
      props: {
        isInGround: true,
        isInTrays: true,
        location: 'H',
      },
    });

    cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
    cy.get('[data-cy="active-plant-asset-bed-picker"]').should('exist');

    cy.get('[data-cy="picker-options"]').should('exist');

    cy.get('[data-cy="picker-options"] input[name="picker-options"]')
      .should('have.length', 2)
      .first()
      .should('have.value', 'H-1');

    cy.get('[data-cy="picker-options"] input[name="picker-options"]')
      .should('have.length', 2)
      .last()
      .should('have.value', 'H-2');
  });
});
