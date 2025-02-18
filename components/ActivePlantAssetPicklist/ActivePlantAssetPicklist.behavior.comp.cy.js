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

  it('Should clear picked checkboxes when the `location` prop changes', () => {
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
          cy.get('[data-cy="picklist-all-button"]').then(($btn) => {
            $btn[0].click();
          });

          cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
            cy.wrap($el).should('be.checked');
          });
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });
          cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
            cy.wrap($el).should('not.be.checked');
          });
        });
    });
  });
});
