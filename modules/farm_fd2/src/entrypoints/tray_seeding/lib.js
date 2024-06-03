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
async function submitForm(formData) {
  try {
    const plantAsset = {
      name: 'plantAsset',
      do: async () => {
        return await farmosUtil.createPlantAsset(
          formData.seedingDate,
          formData.cropName,
          formData.comment
        );
      },
      undo: async (results) => {
        await farmosUtil.deletePlantAsset(results['plantAsset'].id);
      },
    };

    const traysQuantity = {
      name: 'traysQuantity',
      do: async (results) => {
        return await farmosUtil.createStandardQuantity(
          'count',
          formData.trays,
          'Trays',
          'TRAYS',
          results.plantAsset,
          'increment'
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteStandardQuantity(results['traysQuantity'].id);
      },
    };

    const traySizeQuantity = {
      name: 'traySizeQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'ratio',
          formData.traySize,
          'Tray Size',
          'CELLS/TRAY'
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteStandardQuantity(results['traySizeQuantity'].id);
      },
    };

    const seedsQuantity = {
      name: 'seedsQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'count',
          formData.seedsPerCell * formData.trays * formData.traySize,
          'Seeds',
          'SEEDS'
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteStandardQuantity(results['seedsQuantity'].id);
      },
    };

    const seedingLog = {
      name: 'seedingLog',
      do: async (results) => {
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
      undo: async (results) => {
        await farmosUtil.deleteSeedingLog(results['seedingLog'].id);
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
        } else {
          errorMsg += '\n   May be safely ignored';
        }
      }
    }

    throw Error(errorMsg, error);
  }
}

export const lib = {
  submitForm,
};
