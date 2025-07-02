import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('Test the ActivePlantAssetPicklist component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Should fetch new plant assets when the `location` prop changes', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: '',
        isInGround: true,
        isInTrays: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy^="picklist-crop-"]').should('not.exist');
        })
        .then(() => {
          wrapper.setProps({ location: 'ALF' });

          cy.get('[data-cy^="picklist-crop-"]')
            .its('length')
            .then((count) => {
              expect(count).to.equal(3);
            });
        });
    });
  });

  it('Should fetch new plant assets when the `isInGround` prop changes', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'CHUAU',
        isInGround: false,
        isInTrays: false,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy^="picklist-crop-"]').should('not.exist');
        })
        .then(() => {
          wrapper.setProps({ isInGround: true });

          cy.get('[data-cy^="picklist-crop-"]')
            .its('length')
            .then((count) => {
              expect(count).to.equal(8);
            });
        });
    });
  });

  it('Should fetch new plant assets when the `isInTrays` prop changes', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'CHUAU',
        isInGround: false,
        isInTrays: false,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy^="picklist-crop-"]').should('not.exist');
        })
        .then(() => {
          wrapper.setProps({ isInTrays: true });

          cy.get('[data-cy^="picklist-crop-"]')
            .its('length')
            .then((count) => {
              expect(count).to.equal(12);
            });
        });
    });
  });

  it('Shows Picklist and BedPicker when switching from "A" to "ALF"', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'A',
        isInGround: true,
        isInTrays: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="active-plant-asset-picklist"]').should(
            'be.visible'
          );
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        })
        .then(() => {
          wrapper.setProps({
            location: 'ALF',
          });

          cy.get('[data-cy="active-plant-asset-picklist"]').should(
            'be.visible'
          );
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'be.visible'
          );
        });
    });
  });

  it('Hide Picklist and show BedPicker when switching from ALF to H', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        isInGround: true,
        isInTrays: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="active-plant-asset-picklist"]').should(
            'be.visible'
          );
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'be.visible'
          );
        })
        .then(() => {
          wrapper.setProps({
            location: 'H',
          });

          cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'be.visible'
          );
        });
    });
  });

  it('Show Picklist and hide BedPicker when switching from H to A', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'H',
        isInGround: true,
        isInTrays: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'be.visible'
          );
        })
        .then(() => {
          wrapper.setProps({
            location: 'A',
          });

          cy.get('[data-cy="active-plant-asset-picklist"]').should(
            'be.visible'
          );
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        });
    });
  });

  it('Hide Picklist and BedPicker when switching from A to J', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'A',
        isInGround: true,
        isInTrays: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="active-plant-asset-picklist"]').should(
            'be.visible'
          );
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        })
        .then(() => {
          wrapper.setProps({
            location: 'J',
          });

          cy.get('[data-cy="active-plant-asset-picklist"]').should('not.exist');
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        });
    });
  });
});
