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
  try {
    const assetName = formData.seedingDate + '_ts_' + formData.cropName;

    const plantAsset = {
      name: 'plantAsset',
      create: async () => {
        return await farmosUtil.createPlantAsset(
          assetName,
          formData.cropName,
          formData.comment
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deletePlantAsset(uuid);
      },
    };

    const traysQuantity = {
      name: 'traysQuantity',
      create: async (results) => {
        return await farmosUtil.createStandardQuantity(
          'count',
          formData.trays,
          'Trays',
          'TRAYS',
          results.plantAsset,
          'increment'
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deleteStandardQuantity(uuid);
      },
    };

    const traySizeQuantity = {
      name: 'traySizeQuantity',
      create: async () => {
        return await farmosUtil.createStandardQuantity(
          'ratio',
          formData.traySize,
          'Tray Size',
          'CELLS/TRAY'
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deleteStandardQuantity(uuid);
      },
    };

    const seedsQuantity = {
      name: 'seedsQuantity',
      create: async () => {
        return await farmosUtil.createStandardQuantity(
          'count',
          formData.seedsPerCell * formData.trays * formData.traySize,
          'Seeds',
          'SEEDS'
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deleteStandardQuantity(uuid);
      },
    };

    const seedingLog = {
      name: 'seedingLog',
      create: async (results) => {
        return await farmosUtil.createSeedingLog(
          formData.seedingDate,
          formData.locationName,
          [],
          ['seeding', 'seeding_tray'],
          results.plantAsset,
          [
            results.traysQuantity,
            results.traySizeQuantity,
            results.seedsQuantity,
          ]
        );
      },
      delete: async (uuid) => {
        await farmosUtil.deleteSeedingLog(uuid);
      },
    };

    const ops = [
      plantAsset,
      traysQuantity,
      traySizeQuantity,
      seedsQuantity,
      seedingLog,
    ];

    return await farmosUtil.runTransaction(ops);
  } catch (error) {
    console.error('TraySeeding: \n' + error.message);
    console.error(error);

    let errorMsg = 'Error creating tray seeding.';

    for (const key of Object.keys(error.results)) {
      if (error.results[key]) {
        errorMsg +=
          '\n  Result of operation ' + key + ' could not be cleaned up.';
        if (
          error.results[key].attributes &&
          error.results[key].attributes.name
        ) {
          errorMsg += '\n   Manually delete log or asset with:';
          errorMsg += '\n     name: ' + error.results[key].attributes.name;
          //errorMsg += '\n     uuid: ' + error.results[key].id;
        } else {
          errorMsg += '\n   May be safely ignored';
          //errorMsg += '\n     uuid: ' + error.results[key].id;
        }
      }
    }

    throw Error(errorMsg, error);
  }
}
