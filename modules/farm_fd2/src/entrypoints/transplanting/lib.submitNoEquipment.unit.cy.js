import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Submit w/o equipment using the direct_seeding lib.', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let form = {
    cropName: 'BROCCOLI',
    picked: [
      {
        trays: 1,
        data: {
          log_id: '1',
          log_uuid: 'ca7b2961-72da-4469-a2f1-af2abfc60082',
          asset_id: '33',
          asset_uuid: '0d0c5dd3-8888-4931-9f8c-e2998e7e9557',
          date: '2019-03-11',
          user: 'admin',
          crop: 'BROCCOLI',
          trays_location: 'CHUAU',
          asset_locations: 'CHUAU',
          total_trays: 4,
          available_trays: 4,
          tray_size: 128,
          seeds_per_cell: 1,
          total_seeds: 512,
          notes: 'First broccoli tray seeding.',
        },
      },
    ],
    transplantingDate: '1950-01-02',
    location: 'ALF',
    beds: ['ALF-1', 'ALF-3'],
    bedFeet: 100,
    bedWidth: 60,
    rowsPerBed: '1',
    equipment: [],
    depth: 0,
    speed: 0,
    comment: 'A comment',
  };

  let fieldMap = null;
  let result = null;

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getFieldNameToAssetMap()).then((map) => {
      fieldMap = map;
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
    cy.wrap(farmosUtil.getPlantAsset(result.transplantingAsset.id)).then(
      (plantAsset) => {
        expect(plantAsset.type).to.equal('asset--plant');
        expect(plantAsset.attributes.name).to.equal('1950-01-02_BROCCOLI');
        expect(plantAsset.attributes.status).to.equal('active');
        expect(plantAsset.attributes.notes.value).to.equal(form.comment);

        expect(plantAsset.relationships.plant_type[0].type).to.equal(
          'taxonomy_term--plant_type'
        );
        expect(plantAsset.relationships.plant_type[0].id).to.equal(
          result.transplantingAsset.relationships.plant_type[0].id
        );

        expect(plantAsset.relationships.location[0].type).to.equal(
          'asset--land'
        );
        expect(plantAsset.relationships.location[0].id).to.equal(
          fieldMap.get(form.location).id
        );

        expect(plantAsset.attributes.inventory[0].measure).to.equal('length');
        expect(plantAsset.attributes.inventory[0].value).to.equal('100');
        expect(plantAsset.attributes.inventory[0].units).to.equal('FEET');
      }
    );
  });

  it('Check the bed feet quantity--standard', () => {
    cy.wrap(
      farmosUtil.getStandardQuantity(result.transplantingBedFeetQuantity.id)
    ).then((bedFeetQuantity) => {
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
        result.transplantingBedFeetQuantity.relationships.units.id
      );

      expect(bedFeetQuantity.relationships.inventory_asset).to.be.null;
    });
  });

  it('Check the rows/bed quantity--standard', () => {
    cy.wrap(
      farmosUtil.getStandardQuantity(result.transplantingRowsPerBedQuantity.id)
    ).then((rowsPerBedQuantity) => {
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
        result.transplantingRowsPerBedQuantity.relationships.units.id
      );

      expect(rowsPerBedQuantity.relationships.inventory_asset).to.be.null;
    });
  });

  it('Check the row feet quantity--standard', () => {
    cy.wrap(
      farmosUtil.getStandardQuantity(result.transplantingRowFeetQuantity.id)
    ).then((rowFeetQuantity) => {
      expect(rowFeetQuantity.type).to.equal('quantity--standard');
      expect(rowFeetQuantity.attributes.measure).to.equal('length');
      expect(rowFeetQuantity.attributes.value.decimal).to.equal(
        (form.bedFeet * form.rowsPerBed).toString()
      );
      expect(rowFeetQuantity.attributes.label).to.equal('Row Feet');

      expect(rowFeetQuantity.attributes.inventory_adjustment).to.equal(
        'increment'
      );

      expect(rowFeetQuantity.relationships.units.type).to.equal(
        'taxonomy_term--unit'
      );
      expect(rowFeetQuantity.relationships.units.id).to.equal(
        result.transplantingRowFeetQuantity.relationships.units.id
      );

      expect(rowFeetQuantity.relationships.inventory_asset.type).to.equal(
        'asset--plant'
      );
      expect(rowFeetQuantity.relationships.inventory_asset.id).to.equal(
        result.transplantingRowFeetQuantity.relationships.inventory_asset.id
      );
    });
  });

  it('Check the bed width quantity--standard', () => {
    cy.wrap(
      farmosUtil.getStandardQuantity(result.transplantingBedWidthQuantity.id)
    ).then((bedWidthQuantity) => {
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
        result.transplantingBedWidthQuantity.relationships.units.id
      );

      expect(bedWidthQuantity.relationships.inventory_asset).to.be.null;
    });
  });

  it('Check the log--activity', () => {
    cy.wrap(
      farmosUtil.getTransplantingActivityLog(result.transplantingLog.id)
    ).then((transplantingLog) => {
      expect(transplantingLog.type).to.equal('log--activity');
      expect(transplantingLog.attributes.name).to.equal(
        '1950-01-02_xp_BROCCOLI'
      );
      expect(transplantingLog.attributes.timestamp).to.contain('1950-01-02');
      expect(transplantingLog.attributes.status).to.equal('done');
      expect(transplantingLog.attributes.is_movement).to.be.true;

      expect(transplantingLog.relationships.location.length).to.equal(3);
      expect(transplantingLog.relationships.location[0].id).to.equal(
        result.transplantingLog.relationships.location[0].id
      );
      expect(transplantingLog.relationships.location[1].id).to.equal(
        result.transplantingLog.relationships.location[1].id
      );
      expect(transplantingLog.relationships.location[2].id).to.equal(
        result.transplantingLog.relationships.location[2].id
      );

      expect(transplantingLog.relationships.asset[0].type).to.equal(
        'asset--plant'
      );
      expect(transplantingLog.relationships.asset[0].id).to.equal(
        result.transplantingLog.relationships.asset[0].id
      );

      expect(transplantingLog.relationships.category.length).to.equal(1);
      expect(transplantingLog.relationships.category[0].type).to.equal(
        'taxonomy_term--log_category'
      );
      expect(transplantingLog.relationships.category[0].id).to.equal(
        result.transplantingLog.relationships.category[0].id
      );

      expect(transplantingLog.relationships.quantity.length).to.equal(5);

      for (let i = 0; i < 5; i++) {
        expect(transplantingLog.relationships.quantity[i].type).to.equal(
          'quantity--standard'
        );
        expect(transplantingLog.relationships.quantity[i].id).to.equal(
          result.transplantingLog.relationships.quantity[i].id
        );
      }
    });
  });

  it('Check soil disturbance activity log not created', () => {
    expect(result.depthQuantity).to.be.null;
    expect(result.speedQuantity).to.be.null;
    expect(result.activityLog).to.be.null;
  });
});
