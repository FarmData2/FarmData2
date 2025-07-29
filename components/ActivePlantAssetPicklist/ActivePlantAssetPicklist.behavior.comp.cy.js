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

  it('Fetch new plant assets when the `location` prop changes', () => {
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

  it('Fetch new plant assets when the `isInGround` prop changes', () => {
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

  it('Fetch new plant assets when the `isInTrays` prop changes', () => {
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

  it('Filter beds when includeEmptyBeds changes from true to false for ALF', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        isInGround: true,
        isInTrays: true,
        includeEmptyBeds: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Initially shows all beds (ALF-1, ALF-2, ALF-3, ALF-4)
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 4);
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
          ).should('exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
          ).should('exist');
        })
        .then(() => {
          wrapper.setProps({ includeEmptyBeds: false });

          // Now shows only beds with active plant assets (ALF-1, ALF-2)
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 2);
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
          ).should('not.exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
          ).should('not.exist');
        });
    });
  });

  it('Show all beds when includeEmptyBeds changes from false to true for ALF', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        isInGround: true,
        isInTrays: true,
        includeEmptyBeds: false,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Initially shows only beds with active plant assets (ALF-1, ALF-2)
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 2);
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
          ).should('not.exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
          ).should('not.exist');
        })
        .then(() => {
          wrapper.setProps({ includeEmptyBeds: true });

          // Now shows all beds (ALF-1, ALF-2, ALF-3, ALF-4)
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 4);
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
          ).should('exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
          ).should('exist');
        });
    });
  });

  it('Hide bed picker when switching from H (includeEmptyBeds: true) to H (includeEmptyBeds: false)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'H',
        isInGround: true,
        isInTrays: true,
        includeEmptyBeds: true,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Initially shows bed picker with all beds (H-1, H-2)
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should('exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 2);
        })
        .then(() => {
          wrapper.setProps({ includeEmptyBeds: false });

          // Now hides bed picker (no beds with active plant assets)
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        });
    });
  });

  it('Show bed picker when switching from H (includeEmptyBeds: false) to H (includeEmptyBeds: true)', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'H',
        isInGround: true,
        isInTrays: true,
        includeEmptyBeds: false,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Initially hides bed picker (no beds with active plant assets)
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        })
        .then(() => {
          wrapper.setProps({ includeEmptyBeds: true });

          // Now shows bed picker with all beds (H-1, H-2)
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should('exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 2);
        });
    });
  });

  it('Mintain correct bed filtering when changing location with includeEmptyBeds: false', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        isInGround: true,
        isInTrays: true,
        includeEmptyBeds: false,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // ALF with includeEmptyBeds: false shows only ALF-1, ALF-2
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"]'
          ).should('have.length', 2);
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
          ).should('exist');
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-2"]'
          ).should('exist');
        })
        .then(() => {
          wrapper.setProps({ location: 'H' });

          // H with includeEmptyBeds: false shows no beds (no active plant assets)
          cy.get('[data-cy="active-plant-asset-bed-picker"]').should(
            'not.exist'
          );
        });
    });
  });
});
