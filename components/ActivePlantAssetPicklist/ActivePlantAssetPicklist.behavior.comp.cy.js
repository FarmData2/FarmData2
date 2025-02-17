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

  it('Changing location prop fetches new plantAssets', () => {
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

  it('Changing isInGround prop fetches new plantAssets', () => {
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

  it('Changing isInTrays prop fetches new plantAssets', () => {
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

  it('Changing location prop clears picked checkboxes', () => {
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
