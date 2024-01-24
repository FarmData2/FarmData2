import * as lib from './lib';
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

  let greenhouseMap = null;
  let result = null;

  before(() => {
    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((map) => {
      greenhouseMap = map;
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
          /*
           * Note: result.plantAsset is the object that was sent to the server.
           * plantAsset is the object that was retrieved from the server.
           * So we can usually check them against each other and avoid the step of using
           * maps to translate from name to id for things like locations and crops.
           * The exception is when farmOS computes information that is added to the
           * record.  For example, the location of the planting asset is set by farmOS
           * based upon the location specified in the seeding log.
           */
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
          'asset--structure'
        );
        expect(plantAsset.relationships.location[0].id).to.equal(
          greenhouseMap.get(form.locationName).id
        );
      }
    );
  });

  it('Check the trays quantity--standard', () => {
    // Check the trays quantity.
    cy.wrap(farmosUtil.getStandardQuantity(result.traysQuantity.id)).then(
      (traysQuantity) => {
        expect(traysQuantity.type).to.equal('quantity--standard');
        expect(traysQuantity.attributes.measure).to.equal('count');
        expect(traysQuantity.attributes.value.decimal).to.equal(
          form.trays.toString()
        );
        expect(traysQuantity.attributes.label).to.equal('Trays');

        expect(traysQuantity.attributes.inventory_adjustment).to.equal(
          'increment'
        );

        expect(traysQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(traysQuantity.relationships.units.id).to.equal(
          result.traysQuantity.relationships.units.id
        );

        expect(traysQuantity.relationships.inventory_asset.type).to.equal(
          'asset--plant'
        );
        expect(traysQuantity.relationships.inventory_asset.id).to.equal(
          result.traysQuantity.relationships.inventory_asset.id
        );
      }
    );
  });

  it('Check the tray size quantity--standard', () => {
    // Check the tray size quantity.
    cy.wrap(farmosUtil.getStandardQuantity(result.traySizeQuantity.id)).then(
      (traySizeQuantity) => {
        expect(traySizeQuantity.type).to.equal('quantity--standard');
        expect(traySizeQuantity.attributes.measure).to.equal('ratio');
        expect(traySizeQuantity.attributes.value.decimal).to.equal(
          form.traySize.toString()
        );
        expect(traySizeQuantity.attributes.label).to.equal('Tray Size');

        expect(traySizeQuantity.attributes.inventory_adjustment).to.be.null;

        expect(traySizeQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(traySizeQuantity.relationships.units.id).to.equal(
          result.traySizeQuantity.relationships.units.id
        );

        expect(traySizeQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the seeds quantity--standard', () => {
    // Check the seeds quantity.
    cy.wrap(farmosUtil.getStandardQuantity(result.seedsQuantity.id)).then(
      (seedsQuantity) => {
        expect(seedsQuantity.type).to.equal('quantity--standard');
        expect(seedsQuantity.attributes.measure).to.equal('count');
        expect(seedsQuantity.attributes.value.decimal).to.equal(
          (form.seedsPerCell * form.trays * form.traySize).toString()
        );
        expect(seedsQuantity.attributes.label).to.equal('Seeds');

        expect(seedsQuantity.attributes.inventory_adjustment).to.be.null;

        expect(seedsQuantity.relationships.units.type).to.equal(
          'taxonomy_term--unit'
        );
        expect(seedsQuantity.relationships.units.id).to.equal(
          result.seedsQuantity.relationships.units.id
        );

        expect(seedsQuantity.relationships.inventory_asset).to.be.null;
      }
    );
  });

  it('Check the seeding log', () => {
    // Check the seeding log.
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

        expect(seedingLog.relationships.location[0].type).to.equal(
          'asset--structure'
        );
        expect(seedingLog.relationships.location[0].id).to.equal(
          result.seedingLog.relationships.location[0].id
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
});
