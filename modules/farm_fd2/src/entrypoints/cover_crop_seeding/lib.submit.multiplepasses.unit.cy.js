import { lib } from './lib.js';

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
    seedApplicationPasses: 2,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    seedIncorporationPasses: 2,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'Multi-pass test',
  };
  let results = null;

  before(() => {
    const timeout = { timeout: 30000 };
    cy.wrap(lib.submitForm(form), timeout).then((res) => {
      results = res;
    });
  });

  Cypress._.times(form.seedApplicationPasses, (i) => {
    it(`Check the log note and types for application pass ${i + 1}`, () => {
      const activityLog = results[`seedApplicationActivityLog${i}`];
      const depthQty = results[`seedApplicationDepthQuantity${i}`];

      expect(activityLog.type).to.equal('log--activity');
      expect(depthQty.type).to.equal('quantity--standard');

      const expectedNote = `Pass ${i + 1} of ${form.seedApplicationPasses}. ${
        form.comment
      }`;
      expect(activityLog.attributes.notes.value).to.equal(expectedNote);
    });
  });

  it('Check that all created logs and quantities are unique', () => {
    const logIds = [
      results.seedApplicationActivityLog0.id,
      results.seedApplicationActivityLog1.id,
    ];

    const quantityIds = [
      results.seedApplicationDepthQuantity0.id,
      results.seedApplicationDepthQuantity1.id,
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
