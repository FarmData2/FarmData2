import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission using the cover_crop lib.', () => {
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

  let bedMap, categoryMap, cropMap, equipmentMap, fieldMap, unitMap, results;

  before(() => {
    const timeout = { timeout: 30000 };
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
    expect(results.plantAsset.relationships.plant_type).to.have.length(2);
    expect(results.plantAsset.relationships.plant_type[0].id).to.equal(
      cropMap.get(form.crops[0]).id
    );
    expect(results.plantAsset.relationships.plant_type[1].id).to.equal(
      cropMap.get(form.crops[1]).id
    );
    expect(results.plantAsset.relationships.parent).to.have.length(0);
  });

  it('Check the area seeded quantity--standard', () => {
    expect(results.areaSeededQuantity.type).to.equal('quantity--standard');
    expect(results.areaSeededQuantity.attributes.measure).to.equal('ratio');
    expect(results.areaSeededQuantity.attributes.value.decimal).to.equal(
      form.areaSeeded
    );
    expect(results.areaSeededQuantity.attributes.label).to.equal('Area Seeded');
    expect(results.areaSeededQuantity.relationships.units.id).to.equal(
      unitMap.get('PERCENT').id
    );
    expect(results.areaSeededQuantity.relationships.units.type).to.equal(
      'taxonomy_term--unit'
    );
    expect(results.areaSeededQuantity.attributes.inventory_adjustment).to.be
      .null;
    expect(results.areaSeededQuantity.relationships.inventory_asset).to.be.null;
  });

  it('Check the log--seeding', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
    expect(results.seedingLog.attributes.name).to.equal(
      form.date + '_cs_' + form.crops.join('_')
    );
    expect(results.seedingLog.attributes.timestamp).to.contain(form.date);

    expect(results.seedingLog.relationships.location.length).to.equal(3);
    expect(results.seedingLog.relationships.location[0].id).to.equal(
      fieldMap.get(form.location).id
    );
    expect(results.seedingLog.relationships.location[1].id).to.equal(
      bedMap.get(form.beds[0]).id
    );
    expect(results.seedingLog.relationships.location[2].id).to.equal(
      bedMap.get(form.beds[1]).id
    );

    expect(results.seedingLog.relationships.category.length).to.equal(2);
    expect(results.seedingLog.relationships.category[0].id).to.equal(
      categoryMap.get('seeding').id
    );
    expect(results.seedingLog.relationships.category[1].id).to.equal(
      categoryMap.get('seeding_cover_crop').id
    );

    expect(results.seedingLog.relationships.asset[0].id).to.equal(
      results.plantAsset.id
    );

    expect(results.seedingLog.relationships.quantity.length).to.equal(1);
    expect(results.seedingLog.relationships.quantity[0].id).to.equal(
      results.areaSeededQuantity.id
    );
  });

  it('Check the winter kill log--activity', () => {
    expect(results.winterKillLog.type).to.equal('log--activity');
    expect(results.winterKillLog.attributes.name).to.equal(
      form.winterKillDate + '_wk_' + form.crops.join('_')
    );
    expect(results.winterKillLog.attributes.timestamp).to.contain(
      form.winterKillDate
    );

    expect(results.winterKillLog.relationships.location.length).to.equal(3);
    expect(results.winterKillLog.relationships.location[0].id).to.equal(
      fieldMap.get(form.location).id
    );
    expect(results.winterKillLog.relationships.location[1].id).to.equal(
      bedMap.get(form.beds[0]).id
    );
    expect(results.winterKillLog.relationships.location[2].id).to.equal(
      bedMap.get(form.beds[1]).id
    );

    expect(results.winterKillLog.relationships.asset[0].id).to.equal(
      results.plantAsset.id
    );

    expect(results.winterKillLog.relationships.category.length).to.equal(2);
    expect(results.winterKillLog.relationships.category[0].id).to.equal(
      categoryMap.get('termination').id
    );
    expect(results.winterKillLog.relationships.category[1].id).to.equal(
      categoryMap.get('seeding_cover_crop').id
    );

    expect(results.winterKillLog.relationships.quantity).to.be.empty;
    expect(results.winterKillLog.relationships.equipment).to.be.empty;
  });

  it('Check the seed application depth quantity--standard', () => {
    const qty = results.seedApplicationDepthQuantity0;
    expect(qty.type).to.equal('quantity--standard');
    expect(qty.attributes.measure).to.equal('length');
    expect(qty.attributes.value.decimal).to.equal(form.seedApplicationDepth);
    expect(qty.attributes.label).to.equal('Depth');
    expect(qty.relationships.units.id).to.equal(unitMap.get('INCHES').id);
    expect(qty.relationships.inventory_asset).to.be.null;
    expect(qty.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the seed application speed quantity--standard', () => {
    const qty = results.seedApplicationSpeedQuantity0;
    expect(qty.type).to.equal('quantity--standard');
    expect(qty.attributes.measure).to.equal('rate');
    expect(qty.attributes.value.decimal).to.equal(form.seedApplicationSpeed);
    expect(qty.attributes.label).to.equal('Speed');
    expect(qty.relationships.units.id).to.equal(unitMap.get('MPH').id);
    expect(qty.relationships.inventory_asset).to.be.null;
    expect(qty.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the seed application area quantity--standard', () => {
    const qty = results.seedApplicationAreaQuantity0;
    expect(qty.type).to.equal('quantity--standard');
    expect(qty.attributes.measure).to.equal('ratio');
    expect(qty.attributes.value.decimal).to.equal(form.areaSeeded);
    expect(qty.attributes.label).to.equal('Area Seeded for Seed Application');
    expect(qty.relationships.units.id).to.equal(unitMap.get('PERCENT').id);
    expect(qty.relationships.units.type).to.equal('taxonomy_term--unit');
    expect(qty.attributes.inventory_adjustment).to.be.null;
    expect(qty.relationships.inventory_asset).to.be.null;
  });

  it('Check the seed application activity log--activity', () => {
    const log = results.seedApplicationActivityLog0;
    expect(log.type).to.equal('log--activity');
    expect(log.attributes.name).to.equal(form.date + '_sd_' + form.location);
    expect(log.attributes.timestamp).to.contain(form.date);
    expect(log.relationships.location.length).to.equal(3);
    expect(log.relationships.location[0].id).to.equal(
      fieldMap.get(form.location).id
    );
    expect(log.relationships.location[1].id).to.equal(
      bedMap.get(form.beds[0]).id
    );
    expect(log.relationships.location[2].id).to.equal(
      bedMap.get(form.beds[1]).id
    );
    expect(log.relationships.asset[0].id).to.equal(results.plantAsset.id);
    expect(log.relationships.category.length).to.equal(2);
    expect(log.relationships.category[0].id).to.equal(
      categoryMap.get('tillage').id
    );
    expect(log.relationships.category[1].id).to.equal(
      categoryMap.get('seeding_cover_crop').id
    );
    expect(log.relationships.quantity.length).to.equal(3);
    expect(log.relationships.quantity[0].id).to.equal(
      results.seedApplicationDepthQuantity0.id
    );
    expect(log.relationships.quantity[1].id).to.equal(
      results.seedApplicationSpeedQuantity0.id
    );
    expect(log.relationships.quantity[2].id).to.equal(
      results.seedApplicationAreaQuantity0.id
    );
    expect(log.relationships.equipment.length).to.equal(1);
    expect(log.relationships.equipment[0].id).to.equal(
      equipmentMap.get(form.seedApplicationEquipment[0]).id
    );
  });

  it('Check the seed incorporation depth quantity--standard', () => {
    const qty = results.seedIncorporationDepthQuantity0;
    expect(qty.type).to.equal('quantity--standard');
    expect(qty.attributes.measure).to.equal('length');
    expect(qty.attributes.value.decimal).to.equal(form.seedIncorporationDepth);
    expect(qty.attributes.label).to.equal('Depth');
    expect(qty.relationships.units.id).to.equal(unitMap.get('INCHES').id);
    expect(qty.relationships.inventory_asset).to.be.null;
    expect(qty.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the seed incorporation speed quantity--standard', () => {
    const qty = results.seedIncorporationSpeedQuantity0;
    expect(qty.type).to.equal('quantity--standard');
    expect(qty.attributes.measure).to.equal('rate');
    expect(qty.attributes.value.decimal).to.equal(form.seedIncorporationSpeed);
    expect(qty.attributes.label).to.equal('Speed');
    expect(qty.relationships.units.id).to.equal(unitMap.get('MPH').id);
    expect(qty.relationships.inventory_asset).to.be.null;
    expect(qty.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the seed incorporation area quantity--standard', () => {
    const qty = results.seedIncorporationAreaQuantity0;
    expect(qty.type).to.equal('quantity--standard');
    expect(qty.attributes.measure).to.equal('ratio');
    expect(qty.attributes.value.decimal).to.equal(form.areaSeeded);
    expect(qty.attributes.label).to.equal('Area Seeded for Seed Incorporation');
    expect(qty.relationships.units.id).to.equal(unitMap.get('PERCENT').id);
    expect(qty.relationships.units.type).to.equal('taxonomy_term--unit');
    expect(qty.attributes.inventory_adjustment).to.be.null;
    expect(qty.relationships.inventory_asset).to.be.null;
  });

  it('Check the seed incorporation activity log--activity', () => {
    const log = results.seedIncorporationActivityLog0;
    expect(log.type).to.equal('log--activity');
    expect(log.attributes.name).to.equal(form.date + '_sd_' + form.location);
    expect(log.attributes.timestamp).to.contain(form.date);
    expect(log.relationships.location.length).to.equal(3);
    expect(log.relationships.location[0].id).to.equal(
      fieldMap.get(form.location).id
    );
    expect(log.relationships.location[1].id).to.equal(
      bedMap.get(form.beds[0]).id
    );
    expect(log.relationships.location[2].id).to.equal(
      bedMap.get(form.beds[1]).id
    );
    expect(log.relationships.asset[0].id).to.equal(results.plantAsset.id);
    expect(log.relationships.category.length).to.equal(2);
    expect(log.relationships.category[0].id).to.equal(
      categoryMap.get('tillage').id
    );
    expect(log.relationships.category[1].id).to.equal(
      categoryMap.get('seeding_cover_crop').id
    );
    expect(log.relationships.quantity.length).to.equal(3);
    expect(log.relationships.quantity[0].id).to.equal(
      results.seedIncorporationDepthQuantity0.id
    );
    expect(log.relationships.quantity[1].id).to.equal(
      results.seedIncorporationSpeedQuantity0.id
    );
    expect(log.relationships.quantity[2].id).to.equal(
      results.seedIncorporationAreaQuantity0.id
    );
    expect(log.relationships.equipment.length).to.equal(1);
    expect(log.relationships.equipment[0].id).to.equal(
      equipmentMap.get(form.seedIncorporationEquipment[0]).id
    );
  });
});
