import * as farmosUtil from './farmosUtil.js';

describe('Test the permissions checking utility functions', () => {
  /*
   * Note: We do not save and restore the session and local storage
   * here because we need a new farmOS instance for each test.
   */

  it('Admin can create new crop', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then(() => {
      cy.wrap(farmosUtil.canCreatePlantType()).should('be.true');
    });
  });

  it('Guest cannot create new crop', () => {
    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.wrap(farmosUtil.canCreatePlantType()).should('be.false');
    });
  });

  it('Admin can create new land (e.g. field or bed)', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then(() => {
      cy.wrap(farmosUtil.canCreateLand()).should('be.true');
    });
  });

  it('Guest cannot create new land (e.g. field or bed)', () => {
    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.wrap(farmosUtil.canCreateLand()).should('be.false');
    });
  });

  it('Admin can create new structure (e.g. greenhouse)', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then(() => {
      cy.wrap(farmosUtil.canCreateStructure()).should('be.true');
    });
  });

  it('Guest cannot create new structure (e.g. greenhouse)', () => {
    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.wrap(farmosUtil.canCreateStructure()).should('be.false');
    });
  });

  it('Admin can create new tray size', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then(() => {
      cy.wrap(farmosUtil.canCreateTraySize()).should('be.true');
    });
  });

  it('Guest cannot create new tray size', () => {
    cy.wrap(
      farmosUtil.getFarmOSInstance(
        'http://farmos',
        'farm',
        'guest',
        'farmdata2'
      )
    ).then(() => {
      cy.wrap(farmosUtil.canCreateTraySize()).should('be.false');
    });
  });
});
