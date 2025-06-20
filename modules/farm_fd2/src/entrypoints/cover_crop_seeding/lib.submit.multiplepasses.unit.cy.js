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
    it(`Check that log and quantities were created for pass ${i + 1}`, () => {
      expect(results).to.have.property(`seedApplicationDepthQuantity${i}`);
      expect(results).to.have.property(`seedApplicationActivityLog${i}`);
    });
  });

  it('Check that no extra logs were created', () => {
    expect(results).to.not.have.property('seedApplicationActivityLog3');
  });
});
