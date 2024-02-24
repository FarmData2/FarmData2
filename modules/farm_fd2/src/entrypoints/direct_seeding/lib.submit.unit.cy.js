import * as lib from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submission using the direct_seeding lib.', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let form = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    rowsPerBed: '1',
    bedWidth: 60,
    equipment: ['Tractor'],
    depth: 6,
    speed: 5,
    area: 75,
    comment: 'A comment',
  };

  let fieldMap = null;
  let categoryMap = null;
  let result = null;

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then((res) => {
      result = res;
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
    // Check the plant asset.
    cy.wrap(farmosUtil.getPlantAsset(result.plantAsset.id)).then(
      (plantAsset) => {
        expect(plantAsset.type).to.equal('asset--plant');
        expect(plantAsset.attributes.name).to.equal(
          result.plantAsset.attributes.name
        );
        expect(plantAsset.attributes.status).to.equal('active');
        expect(plantAsset.attributes.notes.value).to.equal(form.comment);

        expect(plantAsset.relationships.plant_type[0].type).to.equal(
          'taxonomy_term--plant_type'
        );
        expect(plantAsset.relationships.plant_type[0].id).to.equal(
          result.plantAsset.relationships.plant_type[0].id
        );

        expect(plantAsset.relationships.location[0].type).to.equal(
          'asset--land'
        );
        expect(plantAsset.relationships.location[0].id).to.equal(
          fieldMap.get(form.locationName).id
        );
      }
    );
  });

  it('Check the bed feed quantity--standard', () => {
    cy.wrap(farmosUtil.getStandardQuantity(result.bedFeetQuantity.id)).then(
      (bedFeetQuantity) => {
        expect(bedFeetQuantity.type).to.equal('quantity--standard');
        expect(bedFeetQuantity.attributes.measure).to.equal('length');
        expect(bedFeetQuantity.attributes.value.decimal).to.equal(
          form.bedFeet.toString()
        );
        expect(bedFeetQuantity.attributes.label).to.equal('Bed Feet');

        expect(bedFeetQuantity.attributes.inventory_adjustment).to.be.null;

        expect(bedFeetQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(bedFeetQuantity.relationships.units.id).to.equal(
          result.bedFeetQuantity.relationships.units.id
        );

        expect(bedFeetQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the rows/bed quantity--standard', () => {
    cy.wrap(farmosUtil.getStandardQuantity(result.rowsPerBedQuantity.id)).then(
      (rowsPerBedQuantity) => {
        expect(rowsPerBedQuantity.type).to.equal('quantity--standard');
        expect(rowsPerBedQuantity.attributes.measure).to.equal('ratio');
        expect(rowsPerBedQuantity.attributes.value.decimal).to.equal(
          form.rowsPerBed.toString()
        );
        expect(rowsPerBedQuantity.attributes.label).to.equal('Rows/Bed');

        expect(rowsPerBedQuantity.attributes.inventory_adjustment).to.be.null;

        expect(rowsPerBedQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(rowsPerBedQuantity.relationships.units.id).to.equal(
          result.rowsPerBedQuantity.relationships.units.id
        );

        expect(rowsPerBedQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the bed width quantity--standard', () => {
    cy.wrap(farmosUtil.getStandardQuantity(result.bedWidthQuantity.id)).then(
      (bedWidthQuantity) => {
        expect(bedWidthQuantity.type).to.equal('quantity--standard');
        expect(bedWidthQuantity.attributes.measure).to.equal('length');
        expect(bedWidthQuantity.attributes.value.decimal).to.equal(
          form.bedWidth.toString()
        );
        expect(bedWidthQuantity.attributes.label).to.equal('Bed Width');

        expect(bedWidthQuantity.attributes.inventory_adjustment).to.be.null;

        expect(bedWidthQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(bedWidthQuantity.relationships.units.id).to.equal(
          result.bedWidthQuantity.relationships.units.id
        );

        expect(bedWidthQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the log--seeding', () => {
    cy.wrap(farmosUtil.getSeedingLog(result.seedingLog.id)).then(
      (seedingLog) => {
        expect(seedingLog.type).to.equal('log--seeding');
        expect(seedingLog.attributes.name).to.equal(
          result.seedingLog.attributes.name
        );
        expect(seedingLog.attributes.timestamp).to.contain('1950-01-02');
        expect(seedingLog.attributes.status).to.equal('done');
        expect(seedingLog.attributes.is_movement).to.be.true;
        expect(seedingLog.attributes.purchase_date).to.contain('1950-01-02');

        expect(seedingLog.relationships.location.length).to.equal(3);
        expect(seedingLog.relationships.location[0].id).to.equal(
          result.seedingLog.relationships.location[0].id
        );
        expect(seedingLog.relationships.location[1].id).to.equal(
          result.seedingLog.relationships.location[1].id
        );
        expect(seedingLog.relationships.location[2].id).to.equal(
          result.seedingLog.relationships.location[2].id
        );

        expect(seedingLog.relationships.asset[0].type).to.equal('asset--plant');
        expect(seedingLog.relationships.asset[0].id).to.equal(
          result.seedingLog.relationships.asset[0].id
        );

        expect(seedingLog.relationships.category.length).to.equal(2);
        expect(seedingLog.relationships.category[0].type).to.equal(
          'taxonomy_term--log_category'
        );
        expect(seedingLog.relationships.category[0].id).to.equal(
          result.seedingLog.relationships.category[0].id
        );
        expect(seedingLog.relationships.category[1].type).to.equal(
          'taxonomy_term--log_category'
        );
        expect(seedingLog.relationships.category[1].id).to.equal(
          result.seedingLog.relationships.category[1].id
        );

        expect(seedingLog.relationships.quantity.length).to.equal(3);
        expect(seedingLog.relationships.quantity[0].type).to.equal(
          'quantity--standard'
        );
        expect(seedingLog.relationships.quantity[0].id).to.equal(
          result.seedingLog.relationships.quantity[0].id
        );
        expect(seedingLog.relationships.quantity[1].type).to.equal(
          'quantity--standard'
        );
        expect(seedingLog.relationships.quantity[1].id).to.equal(
          result.seedingLog.relationships.quantity[1].id
        );
        expect(seedingLog.relationships.quantity[2].type).to.equal(
          'quantity--standard'
        );
        expect(seedingLog.relationships.quantity[2].id).to.equal(
          result.seedingLog.relationships.quantity[2].id
        );
      }
    );
  });

  it('Check the depth quantity--standard', () => {
    cy.wrap(farmosUtil.getStandardQuantity(result.depthQuantity.id)).then(
      (depthQuantity) => {
        expect(depthQuantity.type).to.equal('quantity--standard');
        expect(depthQuantity.attributes.measure).to.equal('length');
        expect(depthQuantity.attributes.value.decimal).to.equal(
          form.depth.toString()
        );
        expect(depthQuantity.attributes.label).to.equal('Depth');

        expect(depthQuantity.attributes.inventory_adjustment).to.be.null;

        expect(depthQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(depthQuantity.relationships.units.id).to.equal(
          result.bedWidthQuantity.relationships.units.id
        );

        expect(depthQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the speed quantity--standard', () => {
    cy.wrap(farmosUtil.getStandardQuantity(result.speedQuantity.id)).then(
      (speedQuantity) => {
        expect(speedQuantity.type).to.equal('quantity--standard');
        expect(speedQuantity.attributes.measure).to.equal('rate');
        expect(speedQuantity.attributes.value.decimal).to.equal(
          form.speed.toString()
        );
        expect(speedQuantity.attributes.label).to.equal('Speed');

        expect(speedQuantity.attributes.inventory_adjustment).to.be.null;

        expect(speedQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(speedQuantity.relationships.units.id).to.equal(
          result.speedQuantity.relationships.units.id
        );

        expect(speedQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the area quantity--standard', () => {
    cy.wrap(farmosUtil.getStandardQuantity(result.areaQuantity.id)).then(
      (areaQuantity) => {
        expect(areaQuantity.type).to.equal('quantity--standard');
        expect(areaQuantity.attributes.measure).to.equal('ratio');
        expect(areaQuantity.attributes.value.decimal).to.equal(
          form.area.toString()
        );
        expect(areaQuantity.attributes.label).to.equal('Area');

        expect(areaQuantity.attributes.inventory_adjustment).to.be.null;

        expect(areaQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(areaQuantity.relationships.units.id).to.equal(
          result.areaQuantity.relationships.units.id
        );

        expect(areaQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the soil disturbance log--activity', () => {
    cy.wrap(
      farmosUtil.getSoilDisturbanceActivityLog(result.activityLog.id)
    ).then((activityLog) => {
      expect(activityLog.type).to.equal('log--activity');
      expect(activityLog.attributes.name).to.equal(
        result.plantAsset.attributes.name
      );
      expect(activityLog.attributes.timestamp).to.contain('1950-01-02');
      expect(activityLog.attributes.status).to.equal('done');
      expect(activityLog.attributes.is_movement).to.equal(false);

      expect(activityLog.relationships.location.length).to.equal(3);
      expect(activityLog.relationships.location[0].id).to.equal(
        result.activityLog.relationships.location[0].id
      );
      expect(activityLog.relationships.location[1].id).to.equal(
        result.activityLog.relationships.location[1].id
      );
      expect(activityLog.relationships.location[2].id).to.equal(
        result.activityLog.relationships.location[2].id
      );

      expect(activityLog.relationships.asset[0].id).to.equal(
        result.plantAsset.id
      );

      expect(activityLog.relationships.category.length).to.equal(2);
      expect(activityLog.relationships.category[0].id).to.equal(
        categoryMap.get('tillage').id
      );
      expect(activityLog.relationships.category[1].id).to.equal(
        categoryMap.get('seeding_direct').id
      );

      expect(activityLog.relationships.quantity.length).to.equal(3);
      expect(activityLog.relationships.quantity[0].id).to.equal(
        result.depthQuantity.id
      );
      expect(activityLog.relationships.quantity[1].id).to.equal(
        result.speedQuantity.id
      );
      expect(activityLog.relationships.quantity[2].id).to.equal(
        result.areaQuantity.id
      );
      expect(activityLog.relationships.equipment.length).to.equal(1);
      expect(activityLog.relationships.equipment[0].id).to.equal(
        result.equipment[0].id
      );
    });
  });
});
