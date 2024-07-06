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
    seedIncorporationDepth: 8,
    seedIncorporationSpeed: 3,
    winterKill: true,
    winterKillDate: '1950-12-31',
    comment: 'A comment',
  };

  let bedMap = null;
  let categoryMap = null;
  let cropMap = null;
  let equipmentMap = null;
  let fieldMap = null;
  let unitMap = null;
  let results = null;

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
      bedMap = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });

    cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then((map) => {
      equipmentMap = map;
    });

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
      unitMap = map;
    });

    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then((res) => {
      results = res;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
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
    expect(results.seedApplicationDepthQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(results.seedApplicationDepthQuantity.attributes.measure).to.equal(
      'length'
    );
    expect(
      results.seedApplicationDepthQuantity.attributes.value.decimal
    ).to.equal(form.seedApplicationDepth);
    expect(results.seedApplicationDepthQuantity.attributes.label).to.equal(
      'Depth'
    );
    expect(
      results.seedApplicationDepthQuantity.relationships.units.id
    ).to.equal(unitMap.get('INCHES').id);
    expect(results.seedApplicationDepthQuantity.relationships.inventory_asset)
      .to.be.null;
    expect(results.seedApplicationDepthQuantity.attributes.inventory_adjustment)
      .to.be.null;
  });

  it('Check the seed application speed quantity--standard', () => {
    expect(results.seedApplicationSpeedQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(results.seedApplicationSpeedQuantity.attributes.measure).to.equal(
      'rate'
    );
    expect(
      results.seedApplicationSpeedQuantity.attributes.value.decimal
    ).to.equal(form.seedApplicationSpeed);
    expect(results.seedApplicationSpeedQuantity.attributes.label).to.equal(
      'Speed'
    );
    expect(
      results.seedApplicationSpeedQuantity.relationships.units.id
    ).to.equal(unitMap.get('MPH').id);
    expect(results.seedApplicationSpeedQuantity.relationships.inventory_asset)
      .to.be.null;
    expect(results.seedApplicationSpeedQuantity.attributes.inventory_adjustment)
      .to.be.null;
  });

  it('Check the seed application area quantity--standard', () => {
    expect(results.seedApplicationAreaQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(results.seedApplicationAreaQuantity.attributes.measure).to.equal(
      'ratio'
    );
    expect(
      results.seedApplicationAreaQuantity.attributes.value.decimal
    ).to.equal(form.areaSeeded);
    expect(results.seedApplicationAreaQuantity.attributes.label).to.equal(
      'Area Seeded for Seed Application'
    );
    expect(results.seedApplicationAreaQuantity.relationships.units.id).to.equal(
      unitMap.get('PERCENT').id
    );
    expect(
      results.seedApplicationAreaQuantity.relationships.units.type
    ).to.equal('taxonomy_term--unit');
    expect(results.seedApplicationAreaQuantity.attributes.inventory_adjustment)
      .to.be.null;
    expect(results.seedApplicationAreaQuantity.relationships.inventory_asset).to
      .be.null;
  });

  it('Check the seed application activity log--activity', () => {
    expect(results.seedApplicationActivityLog.type).to.equal('log--activity');
    expect(results.seedApplicationActivityLog.attributes.name).to.equal(
      form.date + '_sd_' + form.location
    );
    expect(results.seedApplicationActivityLog.attributes.timestamp).to.contain(
      form.date
    );

    expect(
      results.seedApplicationActivityLog.relationships.location.length
    ).to.equal(3);
    expect(
      results.seedApplicationActivityLog.relationships.location[0].id
    ).to.equal(fieldMap.get(form.location).id);
    expect(
      results.seedApplicationActivityLog.relationships.location[1].id
    ).to.equal(bedMap.get(form.beds[0]).id);
    expect(
      results.seedApplicationActivityLog.relationships.location[2].id
    ).to.equal(bedMap.get(form.beds[1]).id);

    expect(
      results.seedApplicationActivityLog.relationships.asset[0].id
    ).to.equal(results.plantAsset.id);

    expect(
      results.seedApplicationActivityLog.relationships.category.length
    ).to.equal(2);
    expect(
      results.seedApplicationActivityLog.relationships.category[0].id
    ).to.equal(categoryMap.get('tillage').id);
    expect(
      results.seedApplicationActivityLog.relationships.category[1].id
    ).to.equal(categoryMap.get('seeding_cover_crop').id);

    expect(
      results.seedApplicationActivityLog.relationships.quantity.length
    ).to.equal(3);
    expect(
      results.seedApplicationActivityLog.relationships.quantity[0].id
    ).to.equal(results.seedApplicationDepthQuantity.id);
    expect(
      results.seedApplicationActivityLog.relationships.quantity[1].id
    ).to.equal(results.seedApplicationSpeedQuantity.id);
    expect(
      results.seedApplicationActivityLog.relationships.quantity[2].id
    ).to.equal(results.seedApplicationAreaQuantity.id);

    expect(
      results.seedApplicationActivityLog.relationships.equipment.length
    ).to.equal(1);
    expect(
      results.seedApplicationActivityLog.relationships.equipment[0].id
    ).to.equal(equipmentMap.get(form.seedApplicationEquipment[0]).id);
  });

  it('Check the seed incorporation depth quantity--standard', () => {
    expect(results.seedIncorporationDepthQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(results.seedIncorporationDepthQuantity.attributes.measure).to.equal(
      'length'
    );
    expect(
      results.seedIncorporationDepthQuantity.attributes.value.decimal
    ).to.equal(form.seedIncorporationDepth);
    expect(results.seedIncorporationDepthQuantity.attributes.label).to.equal(
      'Depth'
    );
    expect(
      results.seedIncorporationDepthQuantity.relationships.units.id
    ).to.equal(unitMap.get('INCHES').id);
    expect(results.seedIncorporationDepthQuantity.relationships.inventory_asset)
      .to.be.null;
    expect(
      results.seedIncorporationDepthQuantity.attributes.inventory_adjustment
    ).to.be.null;
  });

  it('Check the seed incorporation speed quantity--standard', () => {
    expect(results.seedIncorporationSpeedQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(results.seedIncorporationSpeedQuantity.attributes.measure).to.equal(
      'rate'
    );
    expect(
      results.seedIncorporationSpeedQuantity.attributes.value.decimal
    ).to.equal(form.seedIncorporationSpeed);
    expect(results.seedIncorporationSpeedQuantity.attributes.label).to.equal(
      'Speed'
    );
    expect(
      results.seedIncorporationSpeedQuantity.relationships.units.id
    ).to.equal(unitMap.get('MPH').id);
    expect(results.seedIncorporationSpeedQuantity.relationships.inventory_asset)
      .to.be.null;
    expect(
      results.seedIncorporationSpeedQuantity.attributes.inventory_adjustment
    ).to.be.null;
  });

  it('Check the seed incorporation area quantity--standard', () => {
    expect(results.seedIncorporationAreaQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(results.seedIncorporationAreaQuantity.attributes.measure).to.equal(
      'ratio'
    );
    expect(
      results.seedIncorporationAreaQuantity.attributes.value.decimal
    ).to.equal(form.areaSeeded);
    expect(results.seedIncorporationAreaQuantity.attributes.label).to.equal(
      'Area Seeded for Seed Incorporation'
    );
    expect(
      results.seedIncorporationAreaQuantity.relationships.units.id
    ).to.equal(unitMap.get('PERCENT').id);
    expect(
      results.seedIncorporationAreaQuantity.relationships.units.type
    ).to.equal('taxonomy_term--unit');
    expect(
      results.seedIncorporationAreaQuantity.attributes.inventory_adjustment
    ).to.be.null;
    expect(results.seedIncorporationAreaQuantity.relationships.inventory_asset)
      .to.be.null;
  });

  it('Check the seed incorporation activity log--activity', () => {
    expect(results.seedIncorporationActivityLog.type).to.equal('log--activity');
    expect(results.seedIncorporationActivityLog.attributes.name).to.equal(
      form.date + '_sd_' + form.location
    );
    expect(
      results.seedIncorporationActivityLog.attributes.timestamp
    ).to.contain(form.date);

    expect(
      results.seedIncorporationActivityLog.relationships.location.length
    ).to.equal(3);
    expect(
      results.seedIncorporationActivityLog.relationships.location[0].id
    ).to.equal(fieldMap.get(form.location).id);
    expect(
      results.seedIncorporationActivityLog.relationships.location[1].id
    ).to.equal(bedMap.get(form.beds[0]).id);
    expect(
      results.seedIncorporationActivityLog.relationships.location[2].id
    ).to.equal(bedMap.get(form.beds[1]).id);

    expect(
      results.seedIncorporationActivityLog.relationships.asset[0].id
    ).to.equal(results.plantAsset.id);

    expect(
      results.seedIncorporationActivityLog.relationships.category.length
    ).to.equal(2);
    expect(
      results.seedIncorporationActivityLog.relationships.category[0].id
    ).to.equal(categoryMap.get('tillage').id);
    expect(
      results.seedIncorporationActivityLog.relationships.category[1].id
    ).to.equal(categoryMap.get('seeding_cover_crop').id);

    expect(
      results.seedIncorporationActivityLog.relationships.quantity.length
    ).to.equal(3);
    expect(
      results.seedIncorporationActivityLog.relationships.quantity[0].id
    ).to.equal(results.seedIncorporationDepthQuantity.id);
    expect(
      results.seedIncorporationActivityLog.relationships.quantity[1].id
    ).to.equal(results.seedIncorporationSpeedQuantity.id);
    expect(
      results.seedIncorporationActivityLog.relationships.quantity[2].id
    ).to.equal(results.seedIncorporationAreaQuantity.id);

    expect(
      results.seedIncorporationActivityLog.relationships.equipment.length
    ).to.equal(1);
    expect(
      results.seedIncorporationActivityLog.relationships.equipment[0].id
    ).to.equal(equipmentMap.get(form.seedIncorporationEquipment[0]).id);
  });
});
