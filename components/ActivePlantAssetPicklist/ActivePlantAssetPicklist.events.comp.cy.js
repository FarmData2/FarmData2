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

  //---------------------- Valid‐state tests  --------------------------//

  it('1) required=false and requiredRow=false should emit valid=true immediately', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: false,
        requiredRow: false,
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

  it('2) required=true and requiredRow=false with a plant picked should emit valid=true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: false,
        onReady: readySpy,
        onValid: validSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picklist-checkbox-0"]').click();

        cy.get('@validSpy')
          .should('have.been.calledTwice')
          .its('secondCall.args.0')
          .should('equal', true);
      });
  });

  it('3) required=true and requiredRow=false with an empty bed picked should emit valid=true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: false,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picker-options"] input[value="ALF-4"]').click();

        cy.get('@validSpy')
          .should('have.been.calledTwice')
          .its('secondCall.args.0')
          .should('equal', true);
      });
  });

  it('4) required=true and requiredRow=false with a plant and an empty bed picked should emit valid=true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: false,
        onReady: readySpy,
        onValid: validSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picklist-checkbox-0"]').click();
        cy.get('@validSpy')
          .should('have.been.calledTwice')
          .its('secondCall.args.0')
          .should('equal', true);

        cy.get('[data-cy="picker-options"] input[value="ALF-4"]').click();
        cy.get('@validSpy').should('have.been.calledTwice');
      });
  });

  it('5) required=true and requiredRow=true with a plant picked should emit valid=true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picklist-checkbox-0"]').click();

        cy.get('@validSpy')
          .should('have.been.calledTwice')
          .its('secondCall.args.0')
          .should('equal', true);
      });
  });

  it('6) required=true and requiredRow=true with a bed and plant picked should emit valid=true', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picker-options"] input[value="ALF-4"]').click();
        cy.get('@validSpy').should('have.been.calledOnce');

        cy.get('[data-cy="picker-options"] input[value="ALF-1"]').click();
        cy.get('[data-cy="picklist-checkbox-0"]').click();

        cy.get('@validSpy')
          .should('have.been.calledTwice')
          .its('secondCall.args.0')
          .should('equal', true);
      });
  });

  it('7) required=true and requiredRow=true with only a bed picked should emit valid=false', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        required: true,
        requiredRow: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });
    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="picker-options"] input[value="ALF-4"]').click();

        cy.get('@validSpy').should('have.been.calledOnce');
      });
  });

  //------------------------ update:picked and update:checkedBeds testing -----------------------------------//

  it('Should emit `update:picked` when crops are selected and then `update:checkedBeds`', () => {
    const readySpy = cy.spy().as('readySpy');
    const rowPickedSpy = cy.spy().as('rowPickedSpy');
    const bedPickedSpy = cy.spy().as('bedPickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': rowPickedSpy,
        'onUpdate:checkedBeds': bedPickedSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');

          // pick row
          cy.get('[data-cy="picklist-checkbox-1"]').check();

          // check if map has the correct values
          cy.get('@rowPickedSpy')
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

          // should have emitted ['ALF-1']
          cy.get('@bedPickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal(['ALF-1']);
            });

          // unpick row
          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();

          // check map is empty
          cy.get('@rowPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((lastCallArgs) => {
              expect(lastCallArgs).to.be.instanceOf(Map);
              expect(lastCallArgs.size).to.equal(0);
            });

          // second call should emit []
          cy.get('@bedPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal([]);
            });
        });
    });
  });

  it('Should emit `update:picked` when crops with no beds are selected and should not emit`update:checkedBeds`', () => {
    const readySpy = cy.spy().as('readySpy');
    const rowPickedSpy = cy.spy().as('rowPickedSpy');
    const bedPickedSpy = cy.spy().as('bedPickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'CHUAU',
        isInTrays: true,
        onReady: readySpy,
        'onUpdate:picked': rowPickedSpy,
        'onUpdate:checkedBeds': bedPickedSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');

          // pick row
          cy.get('[data-cy="picklist-checkbox-1"]').check();

          // check if map has the correct values
          cy.get('@rowPickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((pickedMap) => {
              const pickedRows = Array.from(pickedMap.values());
              expect(
                pickedRows.some(
                  (row) => row.row.crop === 'BROCCOLI' && row.row.bed === 'N/A'
                )
              ).to.be.true;
            });

          // should not emit any bed updates
          cy.get('@bedPickedSpy').should('not.have.been.called');

          // unpick row
          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();

          // check map is empty
          cy.get('@rowPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((lastCallArgs) => {
              expect(lastCallArgs).to.be.instanceOf(Map);
              expect(lastCallArgs.size).to.equal(0);
            });

          // should not emit any bed updates
          cy.get('@bedPickedSpy').should('not.have.been.called');
        });
    });
  });

  it('Should emit `update:checkedBeds` when beds are selected and then `update:picked` if rows corresponding to that bed exist', () => {
    const readySpy = cy.spy().as('readySpy');
    const rowPickedSpy = cy.spy().as('rowPickedSpy');
    const bedPickedSpy = cy.spy().as('bedPickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': rowPickedSpy,
        'onUpdate:checkedBeds': bedPickedSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');

          // pick bed
          cy.contains('[data-cy="picker-options"] label', 'ALF-1').click();

          // should have emitted ['ALF-1']
          cy.get('@bedPickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal(['ALF-1']);
            });

          // check if map has the correct values
          cy.get('@rowPickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((pickedMap) => {
              const rows = Array.from(pickedMap.values()).map(({ row }) => row);

              expect(rows.every((r) => r.bed === 'ALF-1')).to.be.true;
              expect(pickedMap.size).to.equal(2);
            });

          // unpick bed
          cy.contains('[data-cy="picker-options"] label', 'ALF-1').click();

          // second call should emit []
          cy.get('@bedPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal([]);
            });

          // check map is empty
          cy.get('@rowPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((lastCallArgs) => {
              expect(lastCallArgs).to.be.instanceOf(Map);
              expect(lastCallArgs.size).to.equal(0);
            });
        });
    });
  });

  it('Should emit `update:checkedBeds` when beds are selected and should not emit `update:picked` if rows corresponding to that bed do not exist', () => {
    const readySpy = cy.spy().as('readySpy');
    const rowPickedSpy = cy.spy().as('rowPickedSpy');
    const bedPickedSpy = cy.spy().as('bedPickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': rowPickedSpy,
        'onUpdate:checkedBeds': bedPickedSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');

          // pick bed
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
          ).check();

          // should have emitted ['ALF-4']
          cy.get('@bedPickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal(['ALF-4']);
            });

          // ensure no row changes
          cy.get('@rowPickedSpy').should('not.have.been.called');

          // unpick bed
          cy.get(
            '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
          ).uncheck();

          // second call should emit []
          cy.get('@bedPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal([]);
            });

          // ensure that no rows are picked
          cy.get('@rowPickedSpy').should('not.have.been.called');
        });
    });
  });

  it('should not emit `update:picked` and `update:checkedBeds` when the `location` prop changes and no beds and rows are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const rowPickedSpy = cy.spy().as('rowPickedSpy');
    const bedPickedSpy = cy.spy().as('bedPickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': rowPickedSpy,
        'onUpdate:checkedBeds': bedPickedSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');
        });
    });
  });

  it('Should emit `update:picked` and `update:checkedBeds` to reset selections  when the `location` prop updates', () => {
    const readySpy = cy.spy().as('readySpy');
    const rowPickedSpy = cy.spy().as('rowPickedSpy');
    const bedPickedSpy = cy.spy().as('bedPickedSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:picked': rowPickedSpy,
        'onUpdate:checkedBeds': bedPickedSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@rowPickedSpy').should('not.have.been.called');
          cy.get('@bedPickedSpy').should('not.have.been.called');

          // check if map has the correct values
          cy.get('[data-cy="picklist-checkbox-1"]').check();
          cy.get('@rowPickedSpy')
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

          // should have emitted ['ALF-1']
          cy.get('@bedPickedSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal(['ALF-1']);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });

          // map is empty
          cy.get('@rowPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((lastCallArgs) => {
              expect(lastCallArgs).to.be.instanceOf(Map);
              expect(lastCallArgs.size).to.equal(0);
            });

          // second call should emit []
          cy.get('@bedPickedSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((beds) => {
              expect(beds).to.deep.equal([]);
            });
        });
    });
  });

  //------------------------ other event testing -----------------------------------//

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
