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

  //-------------------------------Initial `update:area` emits-----------------------------------//

  it('Should emit `update:area` with an initial value of 0 when the component is created', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy')
            .should('have.been.calledOnce')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        });
    });
  });

  it('should emit `update:area` when a location is initially selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledOnce');
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });
          cy.get('@areaSpy').should('have.been.calledTwice');
        });
    });
  });

  //-------------------------------Verify `update:area` payload calculations-----------------------------------//

  it('should correctly calculate and emit `update:area` when selecting and deselecting crops in a location with beds', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Once on creation and then on location prop update
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select PEPPERS-BELL in ALF-1
          cy.get('[data-cy="picklist-checkbox-0"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(25);
            });

          // Select LETTUCE-ICEBERG in ALF-1
          cy.get('[data-cy="picklist-checkbox-1"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });

          // Select LETTUCE-ICEBERG in ALF-2
          cy.get('[data-cy="picklist-checkbox-2"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 5)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });

          // Unselect LETTUCE-ICEBERG in ALF-1
          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 6)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(75);
            });

          // Unselect PEPPERS-BELL in ALF-1
          cy.get('[data-cy="picklist-checkbox-0"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 7)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });

          // Unselect LETTUCE-ICEBERG in ALF-2
          cy.get('[data-cy="picklist-checkbox-2"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 8)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        });
    });
  });

  it('should correctly calculate and emit `update:area` for a location with active plant assets but no beds', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Once on creation and then on location prop update
          cy.get('@areaSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });

          cy.get('[data-cy="picklist-checkbox-0"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });

          cy.get('[data-cy="picklist-checkbox-1"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });

          // Unselect LETTUCE-ICEBERG in ALF-1
          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 5)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });

          // Unselect PEPPERS-BELL in ALF-1
          cy.get('[data-cy="picklist-checkbox-0"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 6)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        });
    });
  });

  it('should correctly calculate and emit `update:area` for a location with active plant assets and some beds', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'D',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          // Once on creation and then on location prop update
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select BEAN in field
          cy.get('[data-cy="picklist-checkbox-0"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(20);
            });

          // Select RADISH in field
          cy.get('[data-cy="picklist-checkbox-1"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(40);
            });

          // Select LETTUCE-ICEBERG in field
          cy.get('[data-cy="picklist-checkbox-2"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 5)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(60);
            });

          // Select first LETTUCE-ICEBERG in D-1
          cy.get('[data-cy="picklist-checkbox-3"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 6)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(70);
            });

          // Select second LETTUCE-ICEBERG in D-1
          cy.get('[data-cy="picklist-checkbox-4"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 7)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(80);
            });

          // Select LETTUCE-ICEBERG in D-2
          cy.get('[data-cy="picklist-checkbox-5"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 8)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });

          // Unselect BEAN in field
          cy.get('[data-cy="picklist-checkbox-0"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 9)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(80);
            });

          // Unselect RADISH in field
          cy.get('[data-cy="picklist-checkbox-1"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 10)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(60);
            });

          // Unselect LETTUCE-ICEBERG in field
          cy.get('[data-cy="picklist-checkbox-2"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 11)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(40);
            });

          // Unselect first LETTUCE-ICEBERG in D-1
          cy.get('[data-cy="picklist-checkbox-3"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 12)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(30);
            });

          // Unselect LETTUCE-ICEBERG in D-2
          cy.get('[data-cy="picklist-checkbox-5"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 13)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(10);
            });

          // Select first LETTUCE-ICEBERG in D-1
          cy.get('[data-cy="picklist-checkbox-3"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 14)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(20);
            });

          // Unselect second LETTUCE-ICEBERG in D-1
          cy.get('[data-cy="picklist-checkbox-4"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 15)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(10);
            });

          // Select LETTUCE-ICEBERG in D-2
          cy.get('[data-cy="picklist-checkbox-5"]').check();
          cy.get('@areaSpy')
            .should('have.callCount', 16)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(30);
            });

          // Unselect first LETTUCE-ICEBERG in D-1
          cy.get('[data-cy="picklist-checkbox-3"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 17)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(20);
            });

          // Unselect LETTUCE-ICEBERG in D-2
          cy.get('[data-cy="picklist-checkbox-5"]').uncheck();
          cy.get('@areaSpy')
            .should('have.callCount', 18)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        });
    });
  });

  //-------------------------------Check it does not emit `update:area`-----------------------------------//

  it('should not emit `update:area` when switching between locations with beds if no crops are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });
          cy.get('@areaSpy').should('have.been.calledTwice');
        });
    });
  });

  it('should not emit `update:area` when switching from a location with no beds but active plant if no crops are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');
        })
        .then(() => {
          wrapper.setProps({ location: 'E' });
          cy.get('@areaSpy').should('have.been.calledTwice');
        });
    });
  });

  it('should not emit `update:area` when switching from a location with beds to a location with no beds but active plant assets if no crops are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');
        })
        .then(() => {
          wrapper.setProps({ location: 'G' });
          cy.get('@areaSpy').should('have.been.calledTwice');
        });
    });
  });

  it('should not emit `update:area` when switching from a location with no beds but active plant assets to a location with beds if no crops are selected', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');
        })
        .then(() => {
          wrapper.setProps({ location: 'ALF' });
          cy.get('@areaSpy').should('have.been.calledTwice');
        });
    });
  });

  //-------------------------------Check if `update:area` emit reset area within the same type of location if crops picked-----------------------------------//

  it('Should emit `update:area` and reset to 0 when switching between locations with beds after crops were picked', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select a crop
          cy.get('[data-cy="picklist-checkbox-2"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'CHUAU' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0); // Reset area when location changes
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 0 when switching between locations with no beds but active plant assets after crops were picked', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select a crop
          cy.get('[data-cy="picklist-checkbox-0"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'E' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0); // Reset area when location changes
            });
        });
    });
  });

  //-------------------------------Check if `update:area` emit reset area when switching across different types of location if no picked crops-----------------------------------//

  it('Should emit `update:area` and reset to 100 when switching from a location with beds to a location with no beds', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');
        })
        .then(() => {
          wrapper.setProps({ location: 'H' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 0 when switching from a location with no beds to a location with beds', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'H',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100); // default for location with no beds
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'ALF' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 0 when switching from a location with no active plant assets to a location with no beds but has active plant assets', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'H',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'G' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 100 when switching from a location with no beds but has active plant assets to a location with no active plant assets', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy')
            .should('have.been.calledTwice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'H' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });
        });
    });
  });

  //-------------------------------Check if `update:area` emit reset area when switching across different types of location if crops picked-----------------------------------//

  it('Should emit `update:area` and reset to 100 when switching from a location with beds to a location with no active plant assets after selecting crops', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select a crop
          cy.get('[data-cy="picklist-checkbox-2"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'H' });

          // Area should default to a 100
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 100 when switching from a location with no beds but has active plant assets to a location with no active plant assets after selecting crops', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select a crop
          cy.get('[data-cy="picklist-checkbox-0"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'H' });

          // Area should default to a 100
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(100);
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 0 when switching from a location with beds to a location with no beds but has active plant assets after selecting crops', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'ALF',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select a crop
          cy.get('[data-cy="picklist-checkbox-2"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'G' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0); // Reset area when location changes
            });
        });
    });
  });

  it('Should emit `update:area` and reset to 0 when switching from a location with no beds but has active plant assets to a location with beds after selecting crops', () => {
    const readySpy = cy.spy().as('readySpy');
    const areaSpy = cy.spy().as('areaSpy');

    cy.mount(ActivePlantAssetPicklist, {
      props: {
        location: 'G',
        onReady: readySpy,
        'onUpdate:area': areaSpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@areaSpy').should('have.been.calledTwice');

          // Select a crop
          cy.get('[data-cy="picklist-checkbox-0"]').check();
          cy.get('@areaSpy')
            .should('have.been.calledThrice')
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(50);
            });
        })
        .then(() => {
          wrapper.setProps({ location: 'ALF' });

          // Area should reset
          cy.get('@areaSpy')
            .should('have.callCount', 4)
            .its('lastCall.args.0')
            .should((areaValue) => {
              expect(areaValue).to.equal(0); // Reset area when location changes
            });
        });
    });
  });
});
