import { lib } from './lib.js';
// import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission using the cover_crop lib.', () => {
  let form = {
    date: '1950-01-02',
    location: 'ALF',
    crops: ['BEAN'],
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 80,
    winterKill: true,
    winterKillDate: '1950-01-15',
    seedApplicationEquipment: ['Tractor'],
    seedApplicationDepth: 6,
    seedApplicationSpeed: 5,
    seedIncorporationEquipment: ['Shovel'],
    seedIncorporationDepth: 4,
    seedIncorporationSpeed: 3,
    comment: 'A comment',
  };

  // let bedMap = null;
  // let categoryMap = null;
  // let cropMap = null;
  // let equipmentMap = null;
  // let fieldMap = null;
  // let unitMap = null;
  // let results = null;

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    // cy.wrap(farmosUtil.getBedNameToAssetMap()).then((map) => {
    //   bedMap = map;
    // });

    // cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
    //   categoryMap = map;
    // });

    // cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
    //   cropMap = map;
    // });

    // cy.wrap(farmosUtil.getEquipmentNameToAssetMap()).then((map) => {
    //   equipmentMap = map;
    // });

    // cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
    //   fieldMap = map;
    // });

    // cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
    //   unitMap = map;
    // });

    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then(() => {
      // results = res;
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
    // expect(results.coverCropAsset.type).to.equal('asset--plant');
    // expect(results.coverCropAsset.attributes.name).to.equal(
    //   form.date + '_' + form.crops.join(',')
    // );
    // expect(results.coverCropAsset.attributes.notes.value).to.equal(
    //   form.comment
    // );
    // expect(results.coverCropAsset.relationships.plant_type[0].id).to.equal(
    //   cropMap.get(form.crops[0]).id
    // );
    // expect(results.coverCropAsset.relationships.parent).to.have.length(0);
  });

  // it('Check the area seeded quantity--standard', () => {
  //   expect(results.areaSeededQuantity.type).to.equal('quantity--standard');
  //   expect(results.areaSeededQuantity.attributes.measure).to.equal(
  //     'percentage'
  //   );
  //   expect(results.areaSeededQuantity.attributes.value.decimal).to.equal(
  //     form.areaSeeded
  //   );
  //   expect(results.areaSeededQuantity.attributes.label).to.equal('Area Seeded');
  //   expect(results.areaSeededQuantity.relationships.units.id).to.equal(
  //     unitMap.get('%').id
  //   );
  //   expect(results.areaSeededQuantity.attributes.inventory_adjustment).to.be
  //     .null;
  //   expect(results.areaSeededQuantity.relationships.inventory_asset).to.be.null;
  // });

  // it('Check the log--winter kill', () => {
  //   if (form.winterKill) {
  //     expect(results.winterKillLog.type).to.equal('log--activity');
  //     expect(results.winterKillLog.attributes.name).to.equal(
  //       form.winterKillDate + '_winter_kill_' + form.location
  //     );
  //     expect(results.winterKillLog.attributes.timestamp).to.contain(
  //       form.winterKillDate
  //     );

  //     expect(results.winterKillLog.relationships.location.length).to.equal(3);
  //     expect(results.winterKillLog.relationships.location[0].id).to.equal(
  //       fieldMap.get(form.location).id
  //     );
  //     expect(results.winterKillLog.relationships.location[1].id).to.equal(
  //       bedMap.get(form.beds[0]).id
  //     );
  //     expect(results.winterKillLog.relationships.location[2].id).to.equal(
  //       bedMap.get(form.beds[1]).id
  //     );

  //     expect(results.winterKillLog.relationships.category.length).to.equal(1);
  //     expect(results.winterKillLog.relationships.category[0].id).to.equal(
  //       categoryMap.get('winter_kill').id
  //     );
  //   }
  // });

  // it('Check the log--seeding', () => {
  //   expect(results.seedingLog.type).to.equal('log--seeding');
  //   expect(results.seedingLog.attributes.name).to.equal(
  //     form.date + '_cc_' + form.crops.join(',')
  //   );
  //   expect(results.seedingLog.attributes.timestamp).to.contain(form.date);

  //   expect(results.seedingLog.relationships.location.length).to.equal(3);
  //   expect(results.seedingLog.relationships.location[0].id).to.equal(
  //     fieldMap.get(form.location).id
  //   );
  //   expect(results.seedingLog.relationships.location[1].id).to.equal(
  //     bedMap.get(form.beds[0]).id
  //   );
  //   expect(results.seedingLog.relationships.location[2].id).to.equal(
  //     bedMap.get(form.beds[1]).id
  //   );

  //   expect(results.seedingLog.relationships.category.length).to.equal(2);
  //   expect(results.seedingLog.relationships.category[0].id).to.equal(
  //     categoryMap.get('seeding').id
  //   );
  //   expect(results.seedingLog.relationships.category[1].id).to.equal(
  //     categoryMap.get('cover_crop_seeding').id
  //   );

  //   expect(results.seedingLog.relationships.asset[0].id).to.equal(
  //     results.coverCropAsset.id
  //   );

  //   expect(results.seedingLog.relationships.quantity.length).to.equal(1);
  //   expect(results.seedingLog.relationships.quantity[0].id).to.equal(
  //     results.areaSeededQuantity.id
  //   );
  // });

  // it('Check the depth quantity--standard', () => {
  //   expect(results.depthQuantity.type).to.equal('quantity--standard');
  //   expect(results.depthQuantity.attributes.measure).to.equal('length');
  //   expect(results.depthQuantity.attributes.value.decimal).to.equal(
  //     form.seedApplicationDepth
  //   );
  //   expect(results.depthQuantity.attributes.label).to.equal('Depth');
  //   expect(results.depthQuantity.relationships.units.id).to.equal(
  //     unitMap.get('INCHES').id
  //   );
  //   expect(results.depthQuantity.relationships.inventory_asset).to.be.null;
  //   expect(results.depthQuantity.attributes.inventory_adjustment).to.be.null;
  // });

  // it('Check the speed quantity--standard', () => {
  //   expect(results.speedQuantity.type).to.equal('quantity--standard');
  //   expect(results.speedQuantity.attributes.measure).to.equal('rate');
  //   expect(results.speedQuantity.attributes.value.decimal).to.equal(
  //     form.seedApplicationSpeed
  //   );
  //   expect(results.speedQuantity.attributes.label).to.equal('Speed');
  //   expect(results.speedQuantity.relationships.units.id).to.equal(
  //     unitMap.get('MPH').id
  //   );
  //   expect(results.speedQuantity.relationships.inventory_asset).to.be.null;
  //   expect(results.speedQuantity.attributes.inventory_adjustment).to.be.null;
  // });

  // it('Check the seed application log--activity', () => {
  //   expect(results.activityLog.type).to.equal('log--activity');
  //   expect(results.activityLog.attributes.name).to.equal(
  //     form.date + '_seed_application_' + form.location
  //   );
  //   expect(results.activityLog.attributes.timestamp).to.contain(form.date);

  //   expect(results.activityLog.relationships.location.length).to.equal(3);
  //   expect(results.activityLog.relationships.location[0].id).to.equal(
  //     fieldMap.get(form.location).id
  //   );
  //   expect(results.activityLog.relationships.location[1].id).to.equal(
  //     bedMap.get(form.beds[0]).id
  //   );
  //   expect(results.activityLog.relationships.location[2].id).to.equal(
  //     bedMap.get(form.beds[1]).id
  //   );

  //   expect(results.activityLog.relationships.asset[0].id).to.equal(
  //     results.coverCropAsset.id
  //   );

  //   expect(results.activityLog.relationships.category.length).to.equal(2);
  //   expect(results.activityLog.relationships.category[0].id).to.equal(
  //     categoryMap.get('tillage').id
  //   );
  //   expect(results.activityLog.relationships.category[1].id).to.equal(
  //     categoryMap.get('cover_crop_seeding').id
  //   );

  //   expect(results.activityLog.relationships.quantity.length).to.equal(3);
  //   expect(results.activityLog.relationships.quantity[0].id).to.equal(
  //     results.depthQuantity.id
  //   );
  //   expect(results.activityLog.relationships.quantity[1].id).to.equal(
  //     results.speedQuantity.id
  //   );
  //   expect(results.activityLog.relationships.quantity[2].id).to.equal(
  //     results.areaSeededQuantity.id
  //   );

  //   expect(results.activityLog.relationships.equipment.length).to.equal(1);
  //   expect(results.activityLog.relationships.equipment[0].id).to.equal(
  //     equipmentMap.get(form.seedApplicationEquipment[0]).id
  //   );
  // });

  // it('Check the seed incorporation depth quantity--standard', () => {
  //   expect(results.incorporationDepthQuantity.type).to.equal(
  //     'quantity--standard'
  //   );
  //   expect(results.incorporationDepthQuantity.attributes.measure).to.equal(
  //     'length'
  //   );
  //   expect(
  //     results.incorporationDepthQuantity.attributes.value.decimal
  //   ).to.equal(form.seedIncorporationDepth);
  //   expect(results.incorporationDepthQuantity.attributes.label).to.equal(
  //     'Depth'
  //   );
  //   expect(results.incorporationDepthQuantity.relationships.units.id).to.equal(
  //     unitMap.get('INCHES').id
  //   );
  //   expect(results.incorporationDepthQuantity.relationships.inventory_asset).to
  //     .be.null;
  //   expect(results.incorporationDepthQuantity.attributes.inventory_adjustment)
  //     .to.be.null;
  // });

  // it('Check the seed incorporation speed quantity--standard', () => {
  //   expect(results.incorporationSpeedQuantity.type).to.equal(
  //     'quantity--standard'
  //   );
  //   expect(results.incorporationSpeedQuantity.attributes.measure).to.equal(
  //     'rate'
  //   );
  //   expect(
  //     results.incorporationSpeedQuantity.attributes.value.decimal
  //   ).to.equal(form.seedIncorporationSpeed);
  //   expect(results.incorporationSpeedQuantity.attributes.label).to.equal(
  //     'Speed'
  //   );
  //   expect(results.incorporationSpeedQuantity.relationships.units.id).to.equal(
  //     unitMap.get('MPH').id
  //   );
  //   expect(results.incorporationSpeedQuantity.relationships.inventory_asset).to
  //     .be.null;
  //   expect(results.incorporationSpeedQuantity.attributes.inventory_adjustment)
  //     .to.be.null;
  // });

  // it('Check the seed incorporation log--activity', () => {
  //   expect(results.incorporationActivityLog.type).to.equal('log--activity');
  //   expect(results.incorporationActivityLog.attributes.name).to.equal(
  //     form.date + '_seed_incorporation_' + form.location
  //   );
  //   expect(results.incorporationActivityLog.attributes.timestamp).to.contain(
  //     form.date
  //   );

  //   expect(
  //     results.incorporationActivityLog.relationships.location.length
  //   ).to.equal(3);
  //   expect(
  //     results.incorporationActivityLog.relationships.location[0].id
  //   ).to.equal(fieldMap.get(form.location).id);
  //   expect(
  //     results.incorporationActivityLog.relationships.location[1].id
  //   ).to.equal(bedMap.get(form.beds[0]).id);
  //   expect(
  //     results.incorporationActivityLog.relationships.location[2].id
  //   ).to.equal(bedMap.get(form.beds[1]).id);

  //   expect(results.incorporationActivityLog.relationships.asset[0].id).to.equal(
  //     results.coverCropAsset.id
  //   );

  //   expect(
  //     results.incorporationActivityLog.relationships.category.length
  //   ).to.equal(2);
  //   expect(
  //     results.incorporationActivityLog.relationships.category[0].id
  //   ).to.equal(categoryMap.get('tillage').id);
  //   expect(
  //     results.incorporationActivityLog.relationships.category[1].id
  //   ).to.equal(categoryMap.get('cover_crop_seeding').id);

  //   expect(
  //     results.incorporationActivityLog.relationships.quantity.length
  //   ).to.equal(3);
  //   expect(
  //     results.incorporationActivityLog.relationships.quantity[0].id
  //   ).to.equal(results.incorporationDepthQuantity.id);
  //   expect(
  //     results.incorporationActivityLog.relationships.quantity[1].id
  //   ).to.equal(results.incorporationSpeedQuantity.id);
  //   expect(
  //     results.incorporationActivityLog.relationships.quantity[2].id
  //   ).to.equal(results.areaSeededQuantity.id);

  //   expect(
  //     results.incorporationActivityLog.relationships.equipment.length
  //   ).to.equal(1);
  //   expect(
  //     results.incorporationActivityLog.relationships.equipment[0].id
  //   ).to.equal(equipmentMap.get(form.seedIncorporationEquipment[0]).id);
  // });
});
