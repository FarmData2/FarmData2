import { lib } from './lib';
import { lib as directSeedingLib } from '../direct_seeding/lib.js';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

function runTest(terminationValue) {
  describe(`Test the Soil Disturbance lib submission with termination=${terminationValue}`, () => {
    let directSeedingBroccoli = {
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

    let directSeedingBean = {
      seedingDate: '1950-01-02',
      cropName: 'BEAN',
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

    let form = {
      date: '1950-01-02',
      location: 'ALF',
      beds: ['ALF-1', 'ALF-3'],
      termination: terminationValue,
      affectedPlants: [],
      equipment: ['Tractor', 'Rake'],
      depth: 5,
      speed: 6,
      passes: 2,
      area: 100,
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

      cy.wrap(directSeedingLib.submitForm(directSeedingBroccoli), {
        timeout: 15000,
      })
        .then((resultsBroccoli) => {
          form.affectedPlants.push({ uuid: resultsBroccoli.plantAsset.id });
          return cy.wrap(directSeedingLib.submitForm(directSeedingBean), {
            timeout: 15000,
          });
        })
        .then((resultsBean) => {
          form.affectedPlants.push({ uuid: resultsBean.plantAsset.id });
          return cy.wrap(lib.submitForm(form), { timeout: 10000 });
        })
        .then((submitted) => {
          results = submitted;
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

    it('Check affected asset--plant(s)', () => {
      expect(results.affectedPlants).to.have.length(form.affectedPlants.length);
      // check BROCCOLI
      expect(results.affectedPlants[0].id).to.equal(
        form.affectedPlants[0].uuid
      );
      expect(results.affectedPlants[0].type).to.equal('asset--plant');
      expect(results.affectedPlants[0].attributes.name).to.equal(
        directSeedingBroccoli.seedingDate + '_' + directSeedingBroccoli.cropName
      );
      if (terminationValue) {
        expect(results.affectedPlants[0].attributes.status).to.equal(
          'archived'
        );
      } else {
        expect(results.affectedPlants[0].attributes.status).to.equal('active');
      }
      expect(results.affectedPlants[0].relationships.plant_type[0].id).to.equal(
        cropMap.get(directSeedingBroccoli.cropName).id
      );
      // check BEAN
      expect(results.affectedPlants[1].id).to.equal(
        form.affectedPlants[1].uuid
      );
      expect(results.affectedPlants[1].type).to.equal('asset--plant');
      expect(results.affectedPlants[1].attributes.name).to.equal(
        directSeedingBean.seedingDate + '_' + directSeedingBean.cropName
      );
      if (terminationValue) {
        expect(results.affectedPlants[1].attributes.status).to.equal(
          'archived'
        );
      } else {
        expect(results.affectedPlants[1].attributes.status).to.equal('active');
      }
      expect(results.affectedPlants[1].relationships.plant_type[0].id).to.equal(
        cropMap.get(directSeedingBean.cropName).id
      );
    });

    Cypress._.times(form.passes, (i) => {
      it('Check the depth quantity--standard ' + i, () => {
        expect(results['depthQuantity' + i].type).to.equal(
          'quantity--standard'
        );
        expect(results['depthQuantity' + i].attributes.measure).to.equal(
          'length'
        );
        expect(results['depthQuantity' + i].attributes.value.decimal).to.equal(
          form.depth
        );
        expect(results['depthQuantity' + i].attributes.label).to.equal('Depth');
        expect(results['depthQuantity' + i].relationships.units.id).to.equal(
          unitMap.get('INCHES').id
        );
        expect(results['depthQuantity' + i].relationships.inventory_asset).to.be
          .null;
        expect(results['depthQuantity' + i].attributes.inventory_adjustment).to
          .be.null;
      });

      it('Check the speed quantity--standard ' + i, () => {
        expect(results['speedQuantity' + i].type).to.equal(
          'quantity--standard'
        );
        expect(results['speedQuantity' + i].attributes.measure).to.equal(
          'rate'
        );
        expect(results['speedQuantity' + i].attributes.value.decimal).to.equal(
          form.speed
        );
        expect(results['speedQuantity' + i].attributes.label).to.equal('Speed');
        expect(results['speedQuantity' + i].relationships.units.id).to.equal(
          unitMap.get('MPH').id
        );
        expect(results['speedQuantity' + i].relationships.inventory_asset).to.be
          .null;
        expect(results['speedQuantity' + i].attributes.inventory_adjustment).to
          .be.null;
      });

      it('Check the area quantity--standard ' + i, () => {
        expect(results['areaQuantity' + i].type).to.equal('quantity--standard');
        expect(results['areaQuantity' + i].attributes.measure).to.equal(
          'ratio'
        );
        expect(results['areaQuantity' + i].attributes.value.decimal).to.equal(
          form.area
        );
        expect(results['areaQuantity' + i].attributes.label).to.equal('Area');
        expect(results['areaQuantity' + i].relationships.units.id).to.equal(
          unitMap.get('PERCENT').id
        );
        expect(results['areaQuantity' + i].relationships.inventory_asset).to.be
          .null;
        expect(results['areaQuantity' + i].attributes.inventory_adjustment).to
          .be.null;
      });

      it('Check the soil disturbance log--activity ' + i, () => {
        expect(results['activityLog' + i].type).to.equal('log--activity');
        expect(results['activityLog' + i].attributes.name).to.equal(
          form.date + '_sd_' + form.location
        );
        expect(results['activityLog' + i].attributes.timestamp).to.contain(
          form.date
        );
        expect(results['activityLog' + i].attributes.notes.value).to.equal(
          'Pass ' + (i + 1) + ' of ' + form.passes + '. ' + form.comment
        );

        // check locations
        expect(
          results['activityLog' + i].relationships.location.length
        ).to.equal(3);
        expect(
          results['activityLog' + i].relationships.location[0].id
        ).to.equal(fieldMap.get(form.location).id);
        expect(
          results['activityLog' + i].relationships.location[1].id
        ).to.equal(bedMap.get(form.beds[0]).id);
        expect(
          results['activityLog' + i].relationships.location[2].id
        ).to.equal(bedMap.get(form.beds[1]).id);

        // check plant assets
        expect(results['activityLog' + i].relationships.asset).to.have.length(
          form.affectedPlants.length
        );
        expect(results['activityLog' + i].relationships.asset[0].id).to.equal(
          results.affectedPlants[0].id
        );
        expect(results['activityLog' + i].relationships.asset[1].id).to.equal(
          results.affectedPlants[1].id
        );

        // check category
        if (terminationValue) {
          expect(
            results['activityLog' + i].relationships.category.length
          ).to.equal(2);
          expect(
            results['activityLog' + i].relationships.category[0].id
          ).to.equal(categoryMap.get('tillage').id);
          expect(
            results['activityLog' + i].relationships.category[1].id
          ).to.equal(categoryMap.get('termination').id);
        } else {
          expect(
            results['activityLog' + i].relationships.category.length
          ).to.equal(1);
          expect(
            results['activityLog' + i].relationships.category[0].id
          ).to.equal(categoryMap.get('tillage').id);
        }
        // check quantities
        expect(
          results['activityLog' + i].relationships.quantity.length
        ).to.equal(3);
        expect(
          results['activityLog' + i].relationships.quantity[0].id
        ).to.equal(results['depthQuantity' + i].id);
        expect(
          results['activityLog' + i].relationships.quantity[1].id
        ).to.equal(results['speedQuantity' + i].id);
        expect(
          results['activityLog' + i].relationships.quantity[2].id
        ).to.equal(results['areaQuantity' + i].id);

        // check equipment
        expect(
          results['activityLog' + i].relationships.equipment.length
        ).to.equal(form.equipment.length);
        expect(
          results['activityLog' + i].relationships.equipment[0].id
        ).to.equal(equipmentMap.get(form.equipment[0]).id);
        expect(
          results['activityLog' + i].relationships.equipment[1].id
        ).to.equal(equipmentMap.get(form.equipment[1]).id);
      });
    });
  });
}

runTest(true);
runTest(false);
