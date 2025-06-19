import { lib } from './lib.js';

describe('Submission without equipment', () => {
  let results = null;
  const form = {
    date: '2025-06-19',
    crops: ['SPINACH'],
    location: 'ALF',
    beds: [],
    areaSeeded: 100,
    seedApplicationEquipment: [], // NO application equipment
    seedIncorporationEquipment: [], // NO incorporation equipment
    seedApplicationPasses: 1,
    seedIncorporationPasses: 1,
    comment: 'Test with no equipment',
    winterKill: false,
  };

  before(() => {
    // Call the real submitForm function and wait for the result.
    cy.wrap(lib.submitForm(form), { timeout: 20000 }).then((res) => {
      results = res;
    });
  });

  it('Check that a plant asset was created', () => {
    expect(results.plantAsset.type).to.equal('asset--plant');
  });

  it('Check that a seeding log was created', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
  });

  it('Check that no seed application logs were created', () => {
    // Assert that the activity log properties do NOT exist on the result.
    expect(results).to.not.have.property('seedApplicationActivityLog0');
  });

  it('Check that no seed incorporation logs were created', () => {
    expect(results).to.not.have.property('seedIncorporationActivityLog0');
  });
});
