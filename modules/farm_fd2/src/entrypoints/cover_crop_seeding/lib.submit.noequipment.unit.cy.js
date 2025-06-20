import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission without equipment', () => {
  const form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: [],
    seedIncorporationEquipment: [],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedApplicationPasses: 3,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    seedIncorporationPasses: 3,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'Multi-pass test',
  };

  let results = null;

  before(() => {
    const timeout = { timeout: 30000 };
    cy.wrap(farmosUtil.getBedNameToAssetMap(), timeout)
      .then(() => cy.wrap(farmosUtil.getEquipmentNameToAssetMap(), timeout))
      .then(() => cy.wrap(lib.submitForm(form), timeout))
      .then((res) => {
        results = res;
      });
  });

  it('Check the plant asset', () => {
    expect(results.plantAsset.type).to.equal('asset--plant');
  });

  it('Check the main seeding log', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
  });

  it('should NOT create any seed application logs', () => {
    expect(results).to.not.have.property('seedApplicationActivityLog0');
  });

  it('should NOT create any seed incorporation logs', () => {
    expect(results).to.not.have.property('seedIncorporationActivityLog0');
  });
});
