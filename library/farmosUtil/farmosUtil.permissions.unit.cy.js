import * as farmosUtil from './farmosUtil.js';

describe('Test the permissions checking utility functions', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Admin can create new crop', () => {
    cy.wrap(farmosUtil.getFarmOSInstance()).then(() => {
      cy.wrap(farmosUtil.canCreateCrop()).should('be.true');
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
      cy.wrap(farmosUtil.canCreateCrop()).should('be.false');
    });
  });
});
