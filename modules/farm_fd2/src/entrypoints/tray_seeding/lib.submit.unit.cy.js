import * as lib from './lib';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the tray seeding submission', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the tray_seeding entry point.  This will be passed
   * to the lib functions as if it is coming from the tray seeding
   * entry point as a submission.
   */
  let form = {
    seedingDate: '1950-01-01',
    cropName: 'BROCCOLI',
    locationName: 'CHUAU',
    trays: 25,
    traySize: '200',
    seedsPerCell: 3,
    comment: 'A comment',
  };

  /*
   * Variables to hold the map objects that used in the tests. The
   * maps are actually created in the before() function.
   */
  let farm = null;
  let cropMap = null;
  let termMap = null;
  let greenhouseMap = null;
  let categoryMap = null;

  /*
   * Variables to hold the records that are used in the tests.  It is only
   * necessary to have one of each of these types of records, so they are
   * created in the before() function and then used in multiple tests.
   */
  let plantAsset = null;
  let traysQuant = null;
  let traySizeQuant = null;
  let seedsQuant = null;
  let seedingLog = null;

  /*
   * Each time a record is created in the farmOS database, a function that
   * deletes that record is pushed into this array.  This array is then used
   * in the after() function to delete all of the records that were created
   * during the tests.
   *
   * Note: If the tests are interrupted or rerun midstream then the records
   * created in the farmOS database will not be deleted.  This can lead to
   * an accumulation of unused records in the sample database.  The installDB.bash
   * script can be used to reinstall a clean sample database.
   */
  let deleteFunctions = [];

  before(() => {
    /*
     * Create all of the maps that are needed here.
     * Not all of these are used in every test, but collecting them
     * here simplifies the test structure.
     */
    cy.wrap(farmosUtil.getFarmOSInstance()).then((newFarm) => {
      farm = newFarm;
    });
    cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });
    cy.wrap(farmosUtil.getUnitToTermMap()).then((map) => {
      termMap = map;
    });
    cy.wrap(farmosUtil.getGreenhouseNameToAssetMap()).then((map) => {
      greenhouseMap = map;
    });
    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

    /*
     * Create the asset, quantities and log that are needed here.
     * Not all of these are used in every test, but collecting them
     * here simplifies the test structure.
     */
    cy.wrap(lib.createPlantAsset(form))
      .as('plantAsset')
      .then((asset) => {
        plantAsset = asset;
      });

    /*
     * Here we need to ensure that the plantAsset has been created
     * before we try to create the tray quantities.
     */
    cy.get('@plantAsset').then((plantAsset) => {
      cy.wrap(lib.createTraysQuantity(form, plantAsset))
        .as('traysQuant')
        .then((quant) => {
          traysQuant = quant;
        });
    });

    cy.wrap(lib.createTraySizeQuantity(form))
      .as('traySizeQuant')
      .then((quant) => {
        traySizeQuant = quant;
      });

    cy.wrap(lib.createSeedsQuantity(form))
      .as('seedsQuant')
      .then((quant) => {
        seedsQuant = quant;
      });

    cy.get('@plantAsset')
      .then((plantAsset) => {
        cy.get('@traysQuant').then((traysQuant) => {
          cy.get('@traySizeQuant').then((traySizeQuant) => {
            cy.get('@seedsQuant').then((seedsQuant) => {
              return {
                plantAsset,
                traysQuant,
                traySizeQuant,
                seedsQuant,
              };
            });
          });
        });
      })
      .then(({ plantAsset, traysQuant, traySizeQuant, seedsQuant }) => {
        cy.wrap(
          lib.createSeedingLog(
            form,
            plantAsset,
            traysQuant,
            traySizeQuant,
            seedsQuant
          )
        )
          .as(`seedingLog`)
          .then((log) => {
            seedingLog = log;
          });
      });

    /*
     * Setup to cleanup the farmOS records created by this test.  Note
     * that the quantities referenced by a log are also deleted by farmOS
     * when the log is deleted.
     */
    cy.get('@seedingLog').then(() => {
      deleteFunctions.push(() => {
        cy.wrap(farm.log.delete('seeding', seedingLog.id)).then(() => {
          cy.wrap(farm.asset.delete('plant', plantAsset.id));
        });
      });
    });
  });

  after(() => {
    /*
     * Delete all of the farmOS records created by the most recent test.
     * Each test will push functions to the deleteFunctions array to
     * perform the necessary delete operations.  We do the deletes in
     * reverse order because some records cannot be deleted until the
     * ones that reference them are deleted first.
     */
    deleteFunctions
      .slice()
      .reverse()
      .forEach((delFunc) => {
        delFunc();
      });
  });

  beforeEach(() => {
    /*
     * Caching of the farmOS instance and the data for the maps relies
     * on the session storage and local storage.  Cypress clears these
     * between every test.  So we save them in the afterEach() hook,
     * and then restore them in the beforeEach() hook.
     */
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Create plant asset', () => {
    // Fetch the plant asset from farmOS and check it.
    cy.wrap(
      farm.asset
        .fetch({
          filter: { type: 'asset--plant', id: plantAsset.id },
        })
        .then((results) => {
          return results.data[0]; // only one asset with the plantAsset.id.
        })
    ).then((result) => {
      expect(result.attributes.name).to.equal(
        form.seedingDate + '_ts_' + form.cropName
      );
      expect(result.attributes.status).to.equal('active');
      expect(result.attributes.notes.value).to.equal(form.comment);
      expect(result.relationships.plant_type[0].id).to.equal(
        cropMap.get(form.cropName).id
      );
    });
  });

  it('Error creating plant asset', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/asset/plant', {
      statusCode: 401,
    });

    /*
     * Here the then/catch must be inside the wrap because wrap
     * does not have a catch.
     */
    cy.wrap(
      lib
        .createPlantAsset(form)
        .then((asset) => {
          // If an asset is created, be sure it is deleted.
          deleteFunctions.push(() => {
            cy.wrap(farm.asset.delete('plant', asset.id));
          });
          throw new Error('Creating plant asset should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Create trays quantity', () => {
    cy.wrap(
      farm.quantity
        .fetch({
          filter: {
            type: 'quantity--standard',
            id: traysQuant.id,
          },
        })
        .then((results) => {
          return results.data[0];
        })
    ).then((result) => {
      expect(result.attributes.label).to.equal('Trays');
      expect(result.attributes.measure).to.equal('count');
      expect(result.attributes.value.decimal).to.equal(form.trays.toString());
      expect(result.attributes.inventory_adjustment).to.equal('increment');
      expect(result.relationships.units.id).to.equal(termMap.get('TRAYS').id);
      expect(result.relationships.inventory_asset.id).to.equal(plantAsset.id);
    });
  });

  it('Error creating trays quantity', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/quantity/standard', {
      statusCode: 401,
    });

    cy.wrap(
      lib
        .createTraysQuantity(form, { id: 999 }) // fake id b.c. quantity is not created.
        .then((trayQuant) => {
          deleteFunctions.push(() => {
            cy.wrap(farm.quantity.delete('standard', trayQuant.id));
          });
          throw new Error('Creating trays quantity should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Create tray size quantity', () => {
    cy.wrap(
      farm.quantity
        .fetch({
          filter: {
            type: 'quantity--standard',
            id: traySizeQuant.id,
          },
        })
        .then((results) => {
          return results.data[0];
        })
    ).then((result) => {
      expect(result.attributes.label).to.equal('Tray Size');
      expect(result.attributes.measure).to.equal('ratio');
      expect(result.attributes.value.decimal).to.equal(form.traySize);
      expect(result.relationships.units.id).to.equal(
        termMap.get('CELLS/TRAY').id
      );
    });
  });

  it('Error creating tray size quantity', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/quantity/standard', {
      statusCode: 401,
    });

    cy.wrap(
      lib
        .createTraySizeQuantity(form)
        .then((traySizeQuant) => {
          deleteFunctions.push(() => {
            cy.wrap(farm.quantity.delete('standard', traySizeQuant.id));
          });
          throw new Error('Creating tray size quantity should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Create seeds quantity', () => {
    cy.wrap(
      farm.quantity
        .fetch({
          filter: {
            type: 'quantity--standard',
            id: seedsQuant.id,
          },
        })
        .then((results) => {
          return results.data[0];
        })
    ).then((result) => {
      expect(result.attributes.label).to.equal('Seeds');
      expect(result.attributes.measure).to.equal('count');
      expect(result.attributes.value.decimal).to.equal(
        (form.trays * parseInt(form.traySize) * form.seedsPerCell).toString()
      );
      expect(result.relationships.units.id).to.equal(termMap.get('SEEDS').id);
    });
  });

  it('Error creating seeds quantity', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/quantity/standard', {
      statusCode: 401,
    });

    cy.wrap(
      lib
        .createSeedsQuantity(form)
        .then((seedsQuant) => {
          deleteFunctions.push(() => {
            cy.wrap(farm.quantity.delete('standard', seedsQuant.id));
          });
          throw new Error('Creating seeds quantity should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('Create seeding log', () => {
    cy.wrap(
      farm.log
        .fetch({
          filter: {
            type: 'log--seeding',
            id: seedingLog.id,
          },
        })
        .then((results) => {
          return results.data[0];
        })
    ).then((result) => {
      expect(result.attributes.timestamp).to.contain(form.seedingDate);
      expect(result.attributes.purchase_date).not.to.exist;
      expect(result.attributes.name).to.equal(
        form.seedingDate + '_ts_' + form.cropName
      );
      expect(result.attributes.status).to.equal('done');
      expect(result.attributes.is_movement).to.equal(true);
      expect(result.relationships.category[0].id).to.equal(
        categoryMap.get('seeding_tray').id
      );
      expect(result.relationships.location[0].id).to.equal(
        greenhouseMap.get(form.locationName).id
      );
      expect(result.relationships.asset[0].id).to.equal(plantAsset.id);

      expect(result.relationships.quantity.length).to.equal(3);
      expect(result.relationships.quantity[0].id).to.equal(traysQuant.id);
      expect(result.relationships.quantity[1].id).to.equal(traySizeQuant.id);
      expect(result.relationships.quantity[2].id).to.equal(seedsQuant.id);
    });
  });

  it('Error creating seeding log', { retries: 4 }, () => {
    cy.intercept('POST', '**/api/log/seeding', {
      statusCode: 401,
    });

    cy.wrap(
      lib
        .createSeedingLog(
          form,
          { id: 123, attributes: { name: 'test' } }, // plant asset
          { id: 123 }, // trays quantity
          { id: 123 }, // tray size quantity
          { id: 123 } // seeds quantity
        )
        .then((seedingLog) => {
          deleteFunctions.push(() => {
            cy.wrap(farm.log.delete('seeding', seedingLog.id));
          });
          throw new Error('Creating seeding log should have failed.');
        })
        .catch((error) => {
          expect(error.message).to.equal('Request failed with status code 401');
        })
    );
  });

  it('submitForm creates everything', () => {
    cy.wrap(lib.submitForm(form)).then((result) => {
      /*
       * Setup to cleanup the farmOS records created by this test.  Note
       * that the quantities referenced by a log are also deleted by farmOS
       * when the log is deleted.
       */
      deleteFunctions.push(() => {
        cy.wrap(farm.log.delete('seeding', result.seedingLog.id)).then(() => {
          cy.wrap(farm.asset.delete('plant', result.plantAsset.id));
        });
      });

      /*
       * Here we just need to fetch each of the pieces to ensure that
       * they have been created. We do that just by checking the type.
       * The earlier test checked that they were created correctly.
       */
      cy.wrap(
        farm.asset.fetch({
          filter: { type: 'asset--plant', id: result.plantAsset.id },
        })
      ).then((results) => {
        // Just check the type here to be sure it exists.
        expect(results.data[0].type).to.equal('asset--plant');
      });

      cy.wrap(
        farm.quantity.fetch({
          filter: { type: 'quantity--standard', id: result.traysQuantity.id },
        })
      ).then((results) => {
        expect(results.data[0].type).to.equal('quantity--standard');
      });

      cy.wrap(
        farm.quantity.fetch({
          filter: {
            type: 'quantity--standard',
            id: result.traySizeQuantity.id,
          },
        })
      ).then((results) => {
        expect(results.data[0].type).to.equal('quantity--standard');
      });

      cy.wrap(
        farm.quantity.fetch({
          filter: {
            type: 'quantity--standard',
            id: result.seedsQuantity.id,
          },
        })
      ).then((results) => {
        expect(results.data[0].type).to.equal('quantity--standard');
      });

      cy.wrap(
        farm.log.fetch({
          filter: {
            type: 'log--seeding',
            id: result.seedingLog.id,
          },
        })
      ).then((results) => {
        expect(results.data[0].type).to.equal('log--seeding');
      });
    });
  });
});
