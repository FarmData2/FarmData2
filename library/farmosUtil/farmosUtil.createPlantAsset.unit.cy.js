import * as farmosUtil from './farmosUtil.js';

describe('Test the creation of a plant asset', () => {
  var farm = null;
  before(() => {
    cy.wrap(
      farmosUtil
        .getFarmOSInstance('http://farmos', 'farm', 'admin', 'admin')
        .then((newFarm) => {
          farm = newFarm;
        })
    );
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('test createPlantAsset creates an asset--plant record', () => {
    expect(true).to.be.false;
  });

  it('test createPlantAsset throws error if creation fails', () => {
    expect(true).to.be.false;
  });

  it('test additional opts on createPlantAsset', () => {
    expect(true).to.be.false;
  })
});
