import { lib } from './lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import { lib as traySeedingLib } from '../tray_seeding/lib.js';

describe('Submit w/o equipment using the transplanting lib.', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let traySeedingForm = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'CHUAU',
    trays: 25,
    traySize: '200',
    seedsPerCell: 3,
    comment: 'A comment',
  };

  let form = {
    cropName: 'BROCCOLI',
    picked: new Map(),
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

  let cropToTerm = null;
  let result = null;
  let fieldMap = null;
  let bedMap = null;
  let unitMap = null;
  let categoryMap = null;

  before(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.wrap(farmosUtil.getFieldIdToAssetMap()).then((map) => {
      fieldMap = map;
    });

    cy.wrap(farmosUtil.getBedIdToAssetMap()).then((map) => {
      bedMap = map;
    });

    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropToTerm = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
      unitMap = map;
    });

    cy.wrap(traySeedingLib.submitForm(traySeedingForm), { timeout: 10000 })
      .then(() => {
        return cy.wrap(farmosUtil.getSeedlings(traySeedingForm.cropName), {
          timeout: 10000,
        });
      })
      .then((res) => {
        form.picked.set(0, {
          trays: traySeedingForm.trays,
          data: res[res.length - 1],
        });
        return cy.wrap(lib.submitForm(form), { timeout: 10000 });
      })
      .then((res) => {
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

  it('Check the parents', () => {
    expect(result.parents[0].id).to.equal(form.picked.get(0).data.asset_uuid);
    expect(result.parents[0].type).to.equal('asset--plant');
    expect(result.parents[0].attributes.name).to.equal(
      form.picked.get(0).data.date + '_' + form.picked.get(0).data.crop
    );
  });

  it('Check the tray inventory quantity--standard assets', () => {
    expect(result.trayInventoryQuantities[0].attributes.value.decimal).to.equal(
      form.picked.get(0).trays
    );
    expect(result.trayInventoryQuantities[0].type).to.equal(
      'quantity--standard'
    );
    expect(result.trayInventoryQuantities[0].attributes.measure).to.equal(
      'count'
    );
    expect(result.trayInventoryQuantities[0].attributes.label).to.equal(
      'Trays'
    );
    expect(result.trayInventoryQuantities[0].relationships.units.id).to.equal(
      unitMap.get('TRAYS').id
    );
    expect(
      result.trayInventoryQuantities[0].attributes.inventory_adjustment
    ).to.equal('decrement');
    expect(
      result.trayInventoryQuantities[0].relationships.inventory_asset.id
    ).to.equal(form.picked.get(0).data.asset_uuid);
  });

  it('Check the asset--plant', () => {
    // Check the plant asset.
    expect(result.transplantingPlantAsset.type).to.equal('asset--plant');
    expect(result.transplantingPlantAsset.attributes.name).to.equal(
      form.transplantingDate + '_' + form.cropName
    );

    expect(result.transplantingPlantAsset.attributes.status).to.equal('active');
    expect(result.transplantingPlantAsset.attributes.notes.value).to.equal(
      form.comment
    );

    expect(
      result.transplantingPlantAsset.relationships.plant_type[0].type
    ).to.equal(cropToTerm.get(form.cropName).type);

    expect(
      result.transplantingPlantAsset.relationships.plant_type[0].id
    ).to.equal(cropToTerm.get(form.cropName).id);

    expect(result.transplantingPlantAsset.relationships.parent[0].id).to.equal(
      form.picked.get(0).data.asset_uuid
    );
  });

  it('Check the bed feet quantity--standard', () => {
    expect(
      result.transplantingBedFeetQuantity.attributes.value.decimal
    ).to.equal(form.bedFeet);
    expect(result.transplantingBedFeetQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(result.transplantingBedFeetQuantity.attributes.measure).to.equal(
      'length'
    );
    expect(result.transplantingBedFeetQuantity.attributes.label).to.equal(
      'Bed Feet'
    );
    expect(result.transplantingBedFeetQuantity.relationships.units.id).to.equal(
      unitMap.get('FEET').id
    );
    expect(result.transplantingBedFeetQuantity.attributes.inventory_adjustment)
      .to.be.null;
    expect(result.transplantingBedFeetQuantity.relationships.inventory_asset).to
      .be.null;
  });

  it('Check the rows/bed quantity--standard', () => {
    expect(
      result.transplantingRowsPerBedQuantity.attributes.value.decimal
    ).to.equal(form.rowsPerBed);
    expect(result.transplantingRowsPerBedQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(result.transplantingRowsPerBedQuantity.attributes.measure).to.equal(
      'ratio'
    );
    expect(result.transplantingRowsPerBedQuantity.attributes.label).to.equal(
      'Rows/Bed'
    );
    expect(
      result.transplantingRowsPerBedQuantity.relationships.units.id
    ).to.equal(unitMap.get('ROWS/BED').id);
    expect(
      result.transplantingRowsPerBedQuantity.attributes.inventory_adjustment
    ).to.be.null;
    expect(result.transplantingRowsPerBedQuantity.relationships.inventory_asset)
      .to.be.null;
  });

  it('Check the row feet quantity--standard', () => {
    expect(
      result.transplantingRowFeetQuantity.attributes.value.decimal
    ).to.equal(form.rowsPerBed * form.bedFeet);
    expect(result.transplantingRowFeetQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(result.transplantingRowFeetQuantity.attributes.measure).to.equal(
      'length'
    );
    expect(result.transplantingRowFeetQuantity.attributes.label).to.equal(
      'Row Feet'
    );
    expect(result.transplantingRowFeetQuantity.relationships.units.id).to.equal(
      unitMap.get('FEET').id
    );
    expect(
      result.transplantingRowFeetQuantity.attributes.inventory_adjustment
    ).to.equal('increment');
    expect(
      result.transplantingRowFeetQuantity.relationships.inventory_asset.id
    ).to.equal(result.transplantingPlantAsset.id);
  });

  it('Check the bed width quantity--standard', () => {
    expect(
      result.transplantingBedWidthQuantity.attributes.value.decimal
    ).to.equal(form.bedWidth);
    expect(result.transplantingBedWidthQuantity.type).to.equal(
      'quantity--standard'
    );
    expect(result.transplantingBedWidthQuantity.attributes.measure).to.equal(
      'length'
    );
    expect(result.transplantingBedWidthQuantity.attributes.label).to.equal(
      'Bed Width'
    );
    expect(
      result.transplantingBedWidthQuantity.relationships.units.id
    ).to.equal(unitMap.get('INCHES').id);
    expect(result.transplantingBedWidthQuantity.attributes.inventory_adjustment)
      .to.be.null;
    expect(result.transplantingBedWidthQuantity.relationships.inventory_asset)
      .to.be.null;
  });

  it('Check the log--activity', () => {
    expect(result.transplantingLog.attributes.name).to.equal(
      form.transplantingDate + '_xp_' + form.picked.get(0).data.crop
    );
    expect(result.transplantingLog.attributes.timestamp).to.contain(
      form.transplantingDate
    );

    expect(result.transplantingLog.relationships.location.length).to.equal(3);
    expect(
      fieldMap.get(result.transplantingLog.relationships.location[0].id)
        .attributes.name
    ).to.equal(form.location);
    expect(
      bedMap.get(result.transplantingLog.relationships.location[1].id)
        .attributes.name
    ).to.equal(form.beds[0]);
    expect(
      bedMap.get(result.transplantingLog.relationships.location[2].id)
        .attributes.name
    ).to.equal(form.beds[1]);

    expect(result.transplantingLog.relationships.category[0].id).to.equal(
      categoryMap.get('transplanting').id
    );

    expect(result.transplantingLog.relationships.asset[0].id).to.equal(
      result.transplantingPlantAsset.id
    );
    expect(result.transplantingLog.relationships.quantity.length).to.equal(5);
    expect(result.transplantingLog.relationships.quantity[0].id).to.equal(
      result.transplantingBedFeetQuantity.id
    );
    expect(result.transplantingLog.relationships.quantity[1].id).to.equal(
      result.transplantingBedWidthQuantity.id
    );
    expect(result.transplantingLog.relationships.quantity[2].id).to.equal(
      result.transplantingRowsPerBedQuantity.id
    );
    expect(result.transplantingLog.relationships.quantity[3].id).to.equal(
      result.transplantingRowFeetQuantity.id
    );
    expect(result.transplantingLog.relationships.quantity[4].id).to.equal(
      result.trayInventoryQuantities[0].id
    );
  });

  it('Check soil disturbance activity log not created', () => {
    expect(result.depthQuantity).to.be.null;
    expect(result.speedQuantity).to.be.null;
    expect(result.activityLog).to.be.null;
  });
});
