import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission using the cover_crop lib.', () => {
  let form = {
    date: '1950-01-02',
    crops: ['BEAN', 'CARROT'],
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    areaSeeded: 50,
    seedApplicationEquipment: [],
    seedIncorporationEquipment: ['Rake'],
    seedApplicationDepth: 0,
    seedApplicationSpeed: 0,
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

  if (form.winterKill) {
    it('Check the winter kill log--activity', () => {
      console.log(results);
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

      expect(results.winterKillLog.relationships.category.length).to.equal(1);
      expect(results.winterKillLog.relationships.category[0].id).to.equal(
        categoryMap.get('termination').id
      );

      expect(results.winterKillLog.relationships.quantity).to.be.empty;
      expect(results.winterKillLog.relationships.equipment).to.be.empty;
    });
  }

  it('Check seed application depth and speed quantities are null', () => {
    expect(results.seedApplicationDepthQuantity).to.be.null;
    expect(results.seedApplicationSpeedQuantity).to.be.null;
  });

  it('Check seed application activity log not created', () => {
    expect(results.seedApplicationActivityLog).to.be.null;
  });

  if (form.seedIncorporationEquipment.length > 0) {
    it('Check the seed incorporation depth quantity--standard', () => {
      expect(results.seedIncorporationDepthQuantity.type).to.equal(
        'quantity--standard'
      );
      expect(
        results.seedIncorporationDepthQuantity.attributes.measure
      ).to.equal('length');
      expect(
        results.seedIncorporationDepthQuantity.attributes.value.decimal
      ).to.equal(form.seedIncorporationDepth);
      expect(results.seedIncorporationDepthQuantity.attributes.label).to.equal(
        'Depth'
      );
      expect(
        results.seedIncorporationDepthQuantity.relationships.units.id
      ).to.equal(unitMap.get('INCHES').id);
      expect(
        results.seedIncorporationDepthQuantity.relationships.inventory_asset
      ).to.be.null;
      expect(
        results.seedIncorporationDepthQuantity.attributes.inventory_adjustment
      ).to.be.null;
    });

    it('Check the seed incorporation speed quantity--standard', () => {
      expect(results.seedIncorporationSpeedQuantity.type).to.equal(
        'quantity--standard'
      );
      expect(
        results.seedIncorporationSpeedQuantity.attributes.measure
      ).to.equal('rate');
      expect(
        results.seedIncorporationSpeedQuantity.attributes.value.decimal
      ).to.equal(form.seedIncorporationSpeed);
      expect(results.seedIncorporationSpeedQuantity.attributes.label).to.equal(
        'Speed'
      );
      expect(
        results.seedIncorporationSpeedQuantity.relationships.units.id
      ).to.equal(unitMap.get('MPH').id);
      expect(
        results.seedIncorporationSpeedQuantity.relationships.inventory_asset
      ).to.be.null;
      expect(
        results.seedIncorporationSpeedQuantity.attributes.inventory_adjustment
      ).to.be.null;
    });

    it('Check the seed incorporation activity log--activity', () => {
      expect(results.seedIncorporationActivityLog.type).to.equal(
        'log--activity'
      );
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
      ).to.equal(results.areaSeededQuantity.id);

      expect(
        results.seedIncorporationActivityLog.relationships.equipment.length
      ).to.equal(1);
      expect(
        results.seedIncorporationActivityLog.relationships.equipment[0].id
      ).to.equal(equipmentMap.get(form.seedIncorporationEquipment[0]).id);
    });
  }
});
