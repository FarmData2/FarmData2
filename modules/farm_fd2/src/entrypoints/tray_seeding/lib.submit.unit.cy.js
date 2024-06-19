import { lib } from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the tray seeding lib', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let form = {
    seedingDate: '1950-01-02',
    cropName: 'BROCCOLI',
    locationName: 'CHUAU',
    trays: 25,
    traySize: '200',
    seedsPerCell: 3,
    comment: 'A comment',
  };

  let cropMap = null;
  let greenhouseMap = null;
  let logCategoryMap = null;
  let unitMap = null;

  let result = null;

  before(() => {
    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((map) => {
      greenhouseMap = map;
    });

    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });

    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      logCategoryMap = map;
    });

    cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
      unitMap = map;
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
    expect(result.plantAsset.type).to.equal('asset--plant');
    expect(result.plantAsset.attributes.name).to.equal(
      form.seedingDate + '_' + form.cropName
    );
    expect(result.plantAsset.attributes.status).to.equal('active');
    expect(result.plantAsset.attributes.notes.value).to.equal(form.comment);
    expect(result.plantAsset.relationships.plant_type[0].id).to.equal(
      cropMap.get(form.cropName).id
    );
    expect(result.plantAsset.relationships.parent.length).to.equal(0);
  });

  it('Check the trays quantity--standard', () => {
    expect(result.traysQuantity.type).to.equal('quantity--standard');
    expect(result.traysQuantity.attributes.measure).to.equal('count');
    expect(result.traysQuantity.attributes.value.decimal).to.equal(form.trays);
    expect(result.traysQuantity.attributes.label).to.equal('Trays');
    expect(result.traysQuantity.relationships.units.id).to.equal(
      unitMap.get('TRAYS').id
    );

    expect(result.traysQuantity.relationships.inventory_asset.id).to.equal(
      result.plantAsset.id
    );
    expect(result.traysQuantity.attributes.inventory_adjustment).to.equal(
      'increment'
    );
  });

  it('Check the tray size quantity--standard', () => {
    expect(result.traySizeQuantity.type).to.equal('quantity--standard');
    expect(result.traySizeQuantity.attributes.measure).to.equal('ratio');
    expect(result.traySizeQuantity.attributes.value.decimal).to.equal(
      form.traySize
    );
    expect(result.traySizeQuantity.attributes.label).to.equal('Tray Size');
    expect(result.traySizeQuantity.attributes.inventory_adjustment).to.be.null;
    expect(result.traySizeQuantity.relationships.units.id).to.equal(
      unitMap.get('CELLS/TRAY').id
    );

    expect(result.traySizeQuantity.relationships.inventory_asset).to.be.null;
    expect(result.traySizeQuantity.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the seeds quantity--standard', () => {
    expect(result.seedsQuantity.type).to.equal('quantity--standard');
    expect(result.seedsQuantity.attributes.measure).to.equal('count');
    expect(result.seedsQuantity.attributes.value.decimal).to.equal(
      form.seedsPerCell * form.trays * form.traySize
    );
    expect(result.seedsQuantity.attributes.label).to.equal('Seeds');
    expect(result.seedsQuantity.attributes.inventory_adjustment).to.be.null;
    expect(result.seedsQuantity.relationships.units.id).to.equal(
      unitMap.get('SEEDS').id
    );
    expect(result.seedsQuantity.relationships.inventory_asset).to.be.null;
    expect(result.traySizeQuantity.attributes.inventory_adjustment).to.be.null;
  });

  it('Check the seeding log', () => {
    expect(result.seedingLog.type).to.equal('log--seeding');
    expect(result.seedingLog.attributes.name).to.equal(
      form.seedingDate + '_ts_' + form.cropName
    );
    expect(result.seedingLog.attributes.timestamp).to.contain(form.seedingDate);

    expect(result.seedingLog.relationships.location[0].id).to.equal(
      greenhouseMap.get(form.locationName).id
    );

    expect(result.seedingLog.relationships.category.length).to.equal(2);
    expect(result.seedingLog.relationships.category[0].id).to.equal(
      logCategoryMap.get('seeding').id
    );
    expect(result.seedingLog.relationships.category[1].id).to.equal(
      logCategoryMap.get('seeding_tray').id
    );

    expect(result.seedingLog.relationships.asset[0].id).to.equal(
      result.plantAsset.id
    );

    expect(result.seedingLog.relationships.quantity.length).to.equal(3);
    expect(result.seedingLog.relationships.quantity[0].id).to.equal(
      result.traysQuantity.id
    );
    expect(result.seedingLog.relationships.quantity[1].id).to.equal(
      result.traySizeQuantity.id
    );
    expect(result.seedingLog.relationships.quantity[2].id).to.equal(
      result.seedsQuantity.id
    );
  });
});
