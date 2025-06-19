import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission without equipment', () => {
  let results = null;
  let unitMap, categoryMap; // We need these maps for our assertions
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

  // Use the same, complete before() hook as the onepass test.
  before(() => {
    const timeout = { timeout: 20000 };
    cy.wrap(farmosUtil.getBedNameToAssetMap(), timeout)
      .then(() => {})
      .then(() => cy.wrap(farmosUtil.getLogCategoryToTermMap(), timeout))
      .then(() => {})
      .then(() => cy.wrap(farmosUtil.getCropNameToTermMap(), timeout))
      .then(() => {})
      .then(() => cy.wrap(farmosUtil.getEquipmentNameToAssetMap(), timeout))
      .then(() => {})
      .then(() => cy.wrap(farmosUtil.getFieldNameToAssetMap(), timeout))
      .then(() => {})
      .then(() => cy.wrap(farmosUtil.getUnitToTermMap(), timeout))
      .then(() => {})
      .then(() => cy.wrap(lib.submitForm(form), timeout))
      .then((res) => {
        results = res;
      });
  });

  it('Check that a plant asset was created', () => {
    expect(results.plantAsset.type).to.equal('asset--plant');
  });

  it('Check that an area seeded quantity was created', () => {
    expect(results.areaSeededQuantity.type).to.equal('quantity--standard');
    expect(results.areaSeededQuantity.attributes.value.decimal).to.equal(100);
    expect(results.areaSeededQuantity.relationships.units.id).to.equal(
      unitMap.get('PERCENT').id
    );
  });

  it('Check that a seeding log was created correctly', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
    // It should be linked to the area seeded quantity
    expect(results.seedingLog.relationships.quantity[0].id).to.equal(
      results.areaSeededQuantity.id
    );
    // It should have the correct categories
    expect(results.seedingLog.relationships.category[0].id).to.equal(
      categoryMap.get('seeding').id
    );
    expect(results.seedingLog.relationships.category[1].id).to.equal(
      categoryMap.get('seeding_cover_crop').id
    );
  });

  it('Check that no seed application logs or quantities were created', () => {
    expect(results).to.not.have.property('seedApplicationActivityLog0');
    expect(results).to.not.have.property('seedApplicationDepthQuantity0');
  });

  it('Check that no seed incorporation logs or quantities were created', () => {
    expect(results).to.not.have.property('seedIncorporationActivityLog0');
    expect(results).to.not.have.property('seedIncorporationDepthQuantity0');
  });
});
