import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission with multiple passes', () => {
  const form = {
    date: '2025-06-19',
    crops: ['WHEAT'],
    location: 'FIELD A',
    beds: [],
    areaSeeded: 100,
    seedApplicationEquipment: ['Seeding Drill'],
    seedApplicationDepth: 2,
    seedApplicationSpeed: 4,
    seedApplicationPasses: 3,
    seedIncorporationEquipment: [],
    seedIncorporationPasses: 1,
    comment: 'Multi-pass test',
    winterKill: false,
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
