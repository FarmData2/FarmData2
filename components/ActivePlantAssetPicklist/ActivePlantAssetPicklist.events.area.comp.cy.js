import ActivePlantAssetPicklist from '@comps/ActivePlantAssetPicklist/ActivePlantAssetPicklist.vue';

describe('Test the ActivePlantAssetPicklist `update:area` event', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  // --- Check that update:area is emitted at appropriate times ---

  it('Emits `update:area` when location prop is not set.', () => {
    // NOTE: location is required, but code still runs so
    // just checking that we handle it without error.
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy').should('have.been.called');
      });
  });

  it('Emits `update:area` when location prop is set', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'J',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy').should('have.been.called');
      });
  });

  it('Emits `update:area` when switching between locations that change area', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'J',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.called')
        .then(() => {
          cy.get('@areaSpy').should('have.been.called');
        })
        .then(() => {
          areaSpy.resetHistory();
          wrapper.setProps({ location: 'H' });
          cy.get('@areaSpy').should('have.been.called');
        });
    });
  });

  it('Does not emit `update:area` when switching between locations that do not change area', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'A',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.called')
        .then(() => {
          cy.get('@areaSpy').should('have.been.called');
        })
        .then(() => {
          areaSpy.resetHistory();
          wrapper.setProps({ location: 'B' });
          cy.get('@areaSpy').should('not.have.been.called');
        });
    });
  });

  // --- Verify `update:area` calculations ---//

  it('1) Location is not set', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(0);
          });
      });
  });

  it('2) Location with no beds and no active plant assets', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'J',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(100);
          });
      });
  });

  it('3) Location with beds but no active plant assets', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'H',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(100);
          });
      })
      .then(() => {
        areaSpy.resetHistory();

        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="H-1"]'
        ).uncheck();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(50);
          });
      })
      .then(() => {
        areaSpy.resetHistory();

        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="H-2"]'
        ).uncheck();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(0);
          });
      });
  });

  it('4) Location with no beds but active plant assets', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'A',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(0);
          });
      })
      .then(() => {
        areaSpy.resetHistory();

        cy.get('[data-cy="picklist-checkbox-1"]').check();
        cy.get('[data-cy="picklist-checkbox-2"]').check();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(40);
          });
      });
  });

  it('5a) Location with beds and active plant assets - nothing selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(0);
          });
      });
  });

  it('5b) Location with beds and active plant assets - empty bed selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        areaSpy.resetHistory();

        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-3"]'
        ).check();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(25);
          });
      });
  });

  it('5c) Location with beds and active plant assets - non-empty bed selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        areaSpy.resetHistory();

        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-1"]'
        ).check();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(25);
          });
      });
  });

  it('5d) Location with beds and active plant assets - incomplete bed selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        areaSpy.resetHistory();

        cy.get('[data-cy="picklist-checkbox-1"]').check();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(13);
          });
      });
  });

  it('5e) Location with beds and active plant assets - incomplete and empty bed selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        areaSpy.resetHistory();

        cy.get(
          '[data-cy="picker-options"] input[name="picker-options"][value="ALF-4"]'
        ).check();
        cy.get('[data-cy="picklist-checkbox-1"]').check();

        cy.get('@areaSpy')
          .should('have.been.called')
          .its('lastCall.args.0')
          .should((areaValue) => {
            expect(areaValue).to.equal(38);
          });
      });
  });
});
