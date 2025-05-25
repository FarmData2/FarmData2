import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('Test the ActivePlantAssetPicklist component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Should emit `valid` on initialization when `required` prop is set to false', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Should emit `valid` on initialization when `required` prop is set to true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('Should emit `valid` when a crop is picked and `required` prop is set to true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@validSpy').should('have.been.calledOnce');
          cy.get('@validSpy').should('have.been.calledWith', false);

          cy.get('[data-cy="picklist-checkbox-1"]').check();

          cy.get('@validSpy').should('have.been.calledTwice');
          cy.get('@validSpy').should('have.been.calledWith', true);

          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();

          cy.get('@validSpy').should('have.been.calledThrice');
          cy.get('@validSpy').should('have.been.calledWith', false);
        });
    });
  });

  it('Should emit `update:picked` when crops are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const pickedSpy = cy.spy().as('pickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': pickedSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@pickedSpy').should('not.have.been.called');

          // check if map has the correct values
          cy.get('[data-cy="picklist-checkbox-1"]').check();
          cy.get('@pickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((pickedMap) => {
              const pickedRows = Array.from(pickedMap.values());
              expect(
                pickedRows.some(
                  (row) =>
                    row.row.crop === 'LETTUCE-ICEBERG' &&
                    row.row.bed === 'ALF-1'
                )
              ).to.be.true;
            });

          // map is empty
          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();
          cy.get('@pickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((lastCallArgs) => {
              expect(lastCallArgs).to.be.instanceOf(Map);
              expect(lastCallArgs.size).to.equal(0);
            });
        });
    });
  });

  it('should not emit `update:picked` when the `location` prop changes and no crops are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const pickedSpy = cy.spy().as('pickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': pickedSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@pickedSpy').should('not.have.been.called');
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });
          cy.get('@pickedSpy').should('not.have.been.called');
        });
    });
  });

  it('Should emit `update:picked` to reset picked crops when the `location` prop updates', () => {
    const readySpy = cy.spy().as('readySpy');
    const pickedSpy = cy.spy().as('pickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': pickedSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@pickedSpy').should('not.have.been.called');

          // check if map has the correct values
          cy.get('[data-cy="picklist-checkbox-1"]').check();
          cy.get('@pickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((pickedMap) => {
              const pickedRows = Array.from(pickedMap.values());
              expect(
                pickedRows.some(
                  (row) =>
                    row.row.crop === 'LETTUCE-ICEBERG' &&
                    row.row.bed === 'ALF-1'
                )
              ).to.be.true;
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });

          // map is empty
          cy.get('@pickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((lastCallArgs) => {
              expect(lastCallArgs).to.be.instanceOf(Map);
              expect(lastCallArgs.size).to.equal(0);
            });
        });
    });
  });

  it('Should correctly emit `hasPlants` based on the location', () => {
    const readySpy = cy.spy().as('readySpy');
    const hasPlantsSpy = cy.spy().as('hasPlantsSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: '',
        onReady: readySpy,
        onHasPlants: hasPlantsSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Initially should not be called
          cy.get('@hasPlantsSpy').should('not.have.been.called');
        })
        .then(() => {
          // Set location to ALF, which has active plants -> should emit true
          wrapper.setProps({ location: 'ALF' });
          cy.get('@hasPlantsSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should('equal', true);
        })
        .then(() => {
          // Set location to H, which has no active plants -> should emit false
          wrapper.setProps({ location: 'H' });
          cy.get('@hasPlantsSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should('equal', false);
        });
    });
  });

  it('Should emit `error` if unable to fetch plant assets', () => {
    const readySpy = cy.spy().as('readySpy');
    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/farmos/api/fd2_plant_assets?location=*', {
      forceNetworkError: true,
    }).as('farmOSRequest');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'A',
        onReady: readySpy,
        onError: errorSpy,
      },
    });

    cy.wait('@farmOSRequest');

    cy.get('@errorSpy')
      .should('have.been.calledOnce')
      .and('have.been.calledWithMatch', {
        message: 'Unable to fetch plant assets.',
        error: Cypress.sinon.match.instanceOf(Error),
      });
  });
});
