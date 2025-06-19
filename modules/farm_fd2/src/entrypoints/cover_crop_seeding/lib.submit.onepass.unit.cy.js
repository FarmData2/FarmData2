import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission with one pass', () => {
  let form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: ['Tractor'],
    seedIncorporationEquipment: ['Rake'],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedApplicationPasses: 1,
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    seedIncorporationPasses: 1,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'A comment',
  };
  let results = null;
  let bedMap, categoryMap, cropMap, equipmentMap, fieldMap, unitMap;

  before(() => {
    const timeout = { timeout: 20000 };
    cy.wrap(farmosUtil.getBedNameToAssetMap(), timeout)
      .then((map) => {
        bedMap = map;
      })
      .then(() => cy.wrap(farmosUtil.getLogCategoryToTermMap(), timeout))
      .then((map) => {
        categoryMap = map;
      })
      .then(() => cy.wrap(farmosUtil.getCropNameToTermMap(), timeout))
      .then((map) => {
        cropMap = map;
      })
      .then(() => cy.wrap(farmosUtil.getEquipmentNameToAssetMap(), timeout))
      .then((map) => {
        equipmentMap = map;
      })
      .then(() => cy.wrap(farmosUtil.getFieldNameToAssetMap(), timeout))
      .then((map) => {
        fieldMap = map;
      })
      .then(() => cy.wrap(farmosUtil.getUnitToTermMap(), timeout))
      .then((map) => {
        unitMap = map;
      })
      .then(() => cy.wrap(lib.submitForm(form), timeout))
      .then((res) => {
        results = res;
      });
  });

  it('Check the asset--plant', () => {
    expect(results.plantAsset.type).to.equal('asset--plant');
    expect(results.plantAsset.attributes.name).to.equal(
      form.date + '_' + form.crops.join('_')
    );
    expect(results.plantAsset.attributes.notes.value).to.equal(form.comment);
    expect(results.plantAsset.relationships.plant_type[0].id).to.equal(
      cropMap.get(form.crops[0]).id
    );
    expect(results.plantAsset.relationships.plant_type[1].id).to.equal(
      cropMap.get(form.crops[1]).id
    );
  });

  it('Check the area seeded quantity--standard', () => {
    expect(results.areaSeededQuantity.type).to.equal('quantity--standard');
    expect(results.areaSeededQuantity.attributes.value.decimal).to.equal(
      form.areaSeeded
    );
    expect(results.areaSeededQuantity.relationships.units.id).to.equal(
      unitMap.get('PERCENT').id
    );
  });

  it('Check the log--seeding', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
    expect(results.seedingLog.relationships.location[0].id).to.equal(
      fieldMap.get(form.location).id
    );
    expect(results.seedingLog.relationships.location[1].id).to.equal(
      bedMap.get(form.beds[0]).id
    );
    expect(results.seedingLog.relationships.category[0].id).to.equal(
      categoryMap.get('seeding').id
    );
  });

  it('Check the seed application activity log for pass 1', () => {
    const log = results.seedApplicationActivityLog0;
    const depthQty = results.seedApplicationDepthQuantity0;
    const speedQty = results.seedApplicationSpeedQuantity0;
    const areaQty = results.seedApplicationAreaQuantity0;

    expect(log.type).to.equal('log--activity');
    expect(log.relationships.equipment[0].id).to.equal(
      equipmentMap.get(form.seedApplicationEquipment[0]).id
    );
    expect(log.relationships.quantity[0].id).to.equal(depthQty.id);
    expect(log.relationships.quantity[1].id).to.equal(speedQty.id);
    expect(log.relationships.quantity[2].id).to.equal(areaQty.id);
    // Check that a second log does not exist
    expect(results).to.not.have.property('seedApplicationActivityLog1');
  });

  it('Check the seed incorporation activity log for pass 1', () => {
    const log = results.seedIncorporationActivityLog0;
    const depthQty = results.seedIncorporationDepthQuantity0;
    const speedQty = results.seedIncorporationSpeedQuantity0;
    const areaQty = results.seedIncorporationAreaQuantity0;

    expect(log.type).to.equal('log--activity');
    expect(log.relationships.equipment[0].id).to.equal(
      equipmentMap.get(form.seedIncorporationEquipment[0]).id
    );
    expect(log.relationships.quantity[0].id).to.equal(depthQty.id);
    expect(log.relationships.quantity[1].id).to.equal(speedQty.id);
    expect(log.relationships.quantity[2].id).to.equal(areaQty.id);
    // Check that a second log does not exist
    expect(results).to.not.have.property('seedIncorporationActivityLog1');
  });
});
