import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission with multiple passes', () => {
  const form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: ['Tractor'],
    seedIncorporationEquipment: ['Rake'],
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
    const timeout = { timeout: 20000 };
    cy.wrap(farmosUtil.getBedNameToAssetMap(), timeout)
      .then(() => cy.wrap(farmosUtil.getEquipmentNameToAssetMap(), timeout))
      .then(() => cy.wrap(lib.submitForm(form), timeout))
      .then((res) => {
        results = res;
      });
  });

  Cypress._.times(form.seedApplicationPasses, (i) => {
    it(`Check record types for pass ${i + 1}`, () => {
      const activityLog = results[`seedApplicationActivityLog${i}`];
      const depthQty = results[`seedApplicationDepthQuantity${i}`];
      expect(activityLog.type).to.equal('log--activity');
      expect(depthQty.type).to.equal('quantity--standard');
    });
  });

  it('Check that all created logs and quantities are unique', () => {
    const logIds = [
      results.seedApplicationActivityLog0.id,
      results.seedApplicationActivityLog1.id,
      results.seedApplicationActivityLog2.id,
    ];

    const quantityIds = [
      results.seedApplicationDepthQuantity0.id,
      results.seedApplicationDepthQuantity1.id,
      results.seedApplicationDepthQuantity2.id,
    ];

    const logIdSet = new Set(logIds);
    const quantityIdSet = new Set(quantityIds);

    expect(logIdSet.size).to.equal(
      logIds.length,
      'All activity log IDs should be unique'
    );
    expect(quantityIdSet.size).to.equal(
      quantityIds.length,
      'All quantity IDs should be unique'
    );
  });

  it('Check that no extra logs were created', () => {
    expect(results).to.not.have.property('seedApplicationActivityLog3');
  });
});
