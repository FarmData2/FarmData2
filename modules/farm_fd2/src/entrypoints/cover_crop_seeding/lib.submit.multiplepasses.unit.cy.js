import { lib } from './lib.js';

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
    seedApplicationPasses: 3, // Test with 3 passes
    seedIncorporationEquipment: [],
    seedIncorporationPasses: 1,
    comment: 'Multi-pass test',
    winterKill: false,
  };
  let results = null;

  before(() => {
    cy.wrap(lib.submitForm(form), { timeout: 20000 }).then((res) => {
      results = res;
    });
  });

  Cypress._.times(form.seedApplicationPasses, (i) => {
    it(`Check that log and quantities were created for pass ${i + 1}`, () => {
      expect(results).to.have.property(`seedApplicationDepthQuantity${i}`);
      expect(results).to.have.property(`seedApplicationSpeedQuantity${i}`);
      expect(results).to.have.property(`seedApplicationAreaQuantity${i}`);
      expect(results).to.have.property(`seedApplicationActivityLog${i}`);
    });
  });

  it('Check that no extra logs were created', () => {
    // Assert that a 4th log property does not exist.
    expect(results).to.not.have.property('seedApplicationActivityLog3');
  });
});
