import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a tray seeding.
 *
 * @param {Object} formData the form data from the tray seeding form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   plantAsset: {asset--plant},
 *   traysQuantity: {quantity--standard},
 *   traySizeQuantity: {quantity--standard},
 *   seedsQuantity: {quantity--standard},
 *   seedingLog: {log--seeding}
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  let plantAsset = null;
  let traysQuantity = null;
  let traySizeQuantity = null;
  let seedsQuantity = null;
  let seedingLog = null;

  try {
    const assetName = formData.seedingDate + '_ts_' + formData.cropName;
    plantAsset = await farmosUtil.createPlantAsset(
      assetName,
      formData.cropName,
      formData.comment
    );

    traysQuantity = await farmosUtil.createStandardQuantity(
      'count',
      formData.trays,
      'Trays',
      'TRAYS',
      plantAsset,
      'increment'
    );

    traySizeQuantity = await farmosUtil.createStandardQuantity(
      'ratio',
      formData.traySize,
      'Tray Size',
      'CELLS/TRAY'
    );

    seedsQuantity = await farmosUtil.createStandardQuantity(
      'count',
      formData.seedsPerCell * formData.trays * formData.traySize,
      'Seeds',
      'SEEDS'
    );

    seedingLog = await farmosUtil.createSeedingLog(
      formData.seedingDate,
      formData.locationName,
      ['seeding', 'seeding_tray'],
      plantAsset,
      [traysQuantity, traySizeQuantity, seedsQuantity]
    );

    return {
      plantAsset: plantAsset,
      traysQuantity: traysQuantity,
      traySizeQuantity: traySizeQuantity,
      seedsQuantity: seedsQuantity,
      seedingLog: seedingLog,
    };
  } catch (error) {
    console.log('TraySeeding: \n' + error.message);
    console.log(error);

    /*
     * If an error occurred we will delete any of the farmOS records that were created.
     * These must be deleted in the opposite order from the order in which they were
     * created to ensure that a record is not deleted before something that refers to it.
     */
    if (seedingLog) {
      try {
        await farmosUtil.deleteSeedingLog(seedingLog.id);
      } catch (error) {
        console.log('Unable to delete seeding log: ' + seedingLog.id);
      }
    }

    if (seedsQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(seedsQuantity.id);
      } catch (error) {
        console.log('Unable to delete seedsQuantity: ' + seedsQuantity.id);
      }
    }

    if (traySizeQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(traySizeQuantity.id);
      } catch (error) {
        console.log(
          'Unable to delete traySizeQuantity: ' + traySizeQuantity.id
        );
      }
    }

    if (traysQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(traysQuantity.id);
      } catch (error) {
        console.log('Unable to delete traysQuantity: ' + traysQuantity.id);
      }
    }

    if (plantAsset) {
      try {
        await farmosUtil.deletePlantAsset(plantAsset.id);
      } catch (error) {
        console.log('Unable to delete plantAsset: ' + plantAsset.id);
      }
    }

    throw Error('Error creating tray seeding.', error);
  }
}
