import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission using the direct_seeding lib.', () => {
  let form = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    rowsPerBed: '3',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
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
      form.seedingDate + '_' + form.cropName
    );
    expect(results.plantAsset.attributes.notes.value).to.equal(form.comment);
    expect(results.plantAsset.relationships.plant_type[0].id).to.equal(
      cropMap.get(form.cropName).id
    );
    expect(results.plantAsset.relationships.parent).to.have.length(0);
  });

  it('Check the bed feet quantity--standard', () => {
    expect(results.bedFeetQuantity.type).to.equal('quantity--standard');
    expect(results.bedFeetQuantity.attributes.measure).to.equal('length');
    expect(results.bedFeetQuantity.attributes.value.decimal).to.equal(
      form.bedFeet
    );
    expect(results.bedFeetQuantity.attributes.label).to.equal('Bed Feet');
    expect(results.bedFeetQuantity.relationships.units.id).to.equal(
      unitMap.get('FEET').id
    );
    expect(results.bedFeetQuantity.attributes.inventory_adjustment).to.be.null;
    expect(results.bedFeetQuantity.relationships.inventory_asset).to.be.null;
  });

  it('Check the rows/bed quantity--standard', () => {
    expect(results.rowsPerBedQuantity.type).to.equal('quantity--standard');
    expect(results.rowsPerBedQuantity.attributes.measure).to.equal('ratio');
    expect(results.rowsPerBedQuantity.attributes.value.decimal).to.equal(
      form.rowsPerBed
    );
    expect(results.rowsPerBedQuantity.attributes.label).to.equal('Rows/Bed');
    expect(results.rowsPerBedQuantity.relationships.units.id).to.equal(
      unitMap.get('ROWS/BED').id
    );
    expect(results.rowsPerBedQuantity.attributes.inventory_adjustment).to.be
      .null;
    expect(results.rowsPerBedQuantity.relationships.inventory_asset).to.be.null;
  });

  it('Check the row feet quantity--standard', () => {
    expect(results.rowFeetQuantity.type).to.equal('quantity--standard');
    expect(results.rowFeetQuantity.attributes.measure).to.equal('length');
    expect(results.rowFeetQuantity.attributes.label).to.equal('Row Feet');
    expect(results.rowFeetQuantity.attributes.value.decimal).to.equal(
      form.bedFeet * form.rowsPerBed
    );
    expect(results.rowFeetQuantity.relationships.units.id).to.equal(
      unitMap.get('FEET').id
    );

    expect(results.rowFeetQuantity.relationships.inventory_asset.id).to.equal(
      results.plantAsset.id
    );
    expect(results.rowFeetQuantity.attributes.inventory_adjustment).to.equal(
      'increment'
    );
  });

  it('Check the bed width quantity--standard', () => {
    expect(results.bedWidthQuantity.type).to.equal('quantity--standard');
    expect(results.bedWidthQuantity.attributes.measure).to.equal('length');
    expect(results.bedWidthQuantity.attributes.value.decimal).to.equal(
      form.bedWidth
    );
    expect(results.bedWidthQuantity.attributes.label).to.equal('Bed Width');
    expect(results.bedWidthQuantity.relationships.units.id).to.equal(
      unitMap.get('INCHES').id
    );
    expect(results.bedWidthQuantity.attributes.inventory_adjustment).to.be.null;
    expect(results.bedWidthQuantity.relationships.inventory_asset).to.be.null;
  });

  it('Check the log--seeding', () => {
    expect(results.seedingLog.type).to.equal('log--seeding');
    expect(results.seedingLog.attributes.name).to.equal(
      form.seedingDate + '_ds_' + form.cropName
    );
    expect(results.seedingLog.attributes.timestamp).to.contain('1950-01-02');

    expect(results.seedingLog.relationships.location.length).to.equal(3);
    expect(results.seedingLog.relationships.location[0].id).to.equal(
      fieldMap.get(form.locationName).id
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
      categoryMap.get('seeding_direct').id
    );

    expect(results.seedingLog.relationships.asset[0].id).to.equal(
      results.plantAsset.id
    );

    expect(results.seedingLog.relationships.quantity.length).to.equal(4);
    expect(results.seedingLog.relationships.quantity[0].id).to.equal(
      results.bedFeetQuantity.id
    );
    expect(results.seedingLog.relationships.quantity[1].id).to.equal(
      results.rowsPerBedQuantity.id
    );
    expect(results.seedingLog.relationships.quantity[2].id).to.equal(
      results.rowFeetQuantity.id
    );
    expect(results.seedingLog.relationships.quantity[3].id).to.equal(
      results.bedWidthQuantity.id
    );
  });

  it('Check the depth quantity--standard', () => {
    expect(results.depthQuantity.type).to.equal('quantity--standard');
    expect(results.depthQuantity.attributes.measure).to.equal('length');
    expect(results.depthQuantity.attributes.value.decimal).to.equal(form.depth);
    expect(results.depthQuantity.attributes.label).to.equal('Depth');
    expect(results.depthQuantity.relationships.units.id).to.equal(
      unitMap.get('INCHES').id
    );
    expect(results.depthQuantity.relationships.inventory_asset).to.be.null;
    expect(results.depthQuantity.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the speed quantity--standard', () => {
    expect(results.speedQuantity.type).to.equal('quantity--standard');
    expect(results.speedQuantity.attributes.measure).to.equal('rate');
    expect(results.speedQuantity.attributes.value.decimal).to.equal(form.speed);
    expect(results.speedQuantity.attributes.label).to.equal('Speed');
    expect(results.speedQuantity.relationships.units.id).to.equal(
      unitMap.get('MPH').id
    );
    expect(results.speedQuantity.relationships.inventory_asset).to.be.null;
    expect(results.speedQuantity.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the soil disturbance log--activity', () => {
    expect(results.activityLog.type).to.equal('log--activity');
    expect(results.activityLog.attributes.name).to.equal(
      form.seedingDate + '_sd_' + form.locationName
    );
    expect(results.activityLog.attributes.timestamp).to.contain('1950-01-02');

    expect(results.seedingLog.relationships.location.length).to.equal(3);
    expect(results.seedingLog.relationships.location[0].id).to.equal(
      fieldMap.get(form.locationName).id
    );
    expect(results.seedingLog.relationships.location[1].id).to.equal(
      bedMap.get(form.beds[0]).id
    );
    expect(results.seedingLog.relationships.location[2].id).to.equal(
      bedMap.get(form.beds[1]).id
    );

    expect(results.activityLog.relationships.asset[0].id).to.equal(
      results.plantAsset.id
    );

    expect(results.activityLog.relationships.category.length).to.equal(2);
    expect(results.activityLog.relationships.category[0].id).to.equal(
      categoryMap.get('tillage').id
    );
    expect(results.activityLog.relationships.category[1].id).to.equal(
      categoryMap.get('seeding_direct').id
    );

    expect(results.activityLog.relationships.quantity.length).to.equal(3);
    expect(results.activityLog.relationships.quantity[0].id).to.equal(
      results.depthQuantity.id
    );
    expect(results.activityLog.relationships.quantity[1].id).to.equal(
      results.speedQuantity.id
    );
    expect(results.activityLog.relationships.quantity[2].id).to.equal(
      results.bedFeetQuantity.id
    );

    expect(results.activityLog.relationships.equipment.length).to.equal(1);
    expect(results.activityLog.relationships.equipment[0].id).to.equal(
      equipmentMap.get(form.equipment[0]).id
    );
  });
});
