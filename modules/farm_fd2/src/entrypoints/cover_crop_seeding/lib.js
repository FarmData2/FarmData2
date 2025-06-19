import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a cover crop seeding
 *
 * @param {Object} formData the form data from the cover crop seeding form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   plantAsset: {asset--plant},
 *   areaSeededQuantity: {quantity--standard},
 *   winterKillLog: {log--activity},
 *   seedingLog: {log--seeding},
 *   seedApplicationDepthQuantity: {quantity--standard},
 *   seedApplicationSpeedQuantity: {quantity--standard},
 *   seedApplicationAreaQuantity: {quantity--standard},
 *   seedApplicationEquipment: [ {asset--equipment} ],
 *   seedApplicationActivityLog: [ {log--activity} ],
 *   seedIncorporationDepthQuantity: {quantity--standard},
 *   seedIncorporationSpeedQuantity: {quantity--standard},
 *   seedIncorporationAreaQuantity: {quantity--standard},
 *   seedIncorporationEquipment: [ {asset--equipment} ],
 *   seedIncorporationActivityLog: [ {log--activity} ],
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
async function submitForm(formData) {
  try {
    let ops = [];
    const seedApplicationEquipmentAssets = [];
    const seedIncorporationEquipmentAssets = [];
    const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();

    const plantAsset = {
      name: 'plantAsset',
      do: async () => {
        return await farmosUtil.createPlantAsset(
          formData.date,
          formData.crops,
          formData.comment
        );
      },
      undo: async (results) => {
        await farmosUtil.deletePlantAsset(results['plantAsset'].id);
      },
    };
    ops.push(plantAsset);

    const areaSeededQuantity = {
      name: 'areaSeededQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'ratio',
          formData.areaSeeded,
          'Area Seeded',
          'PERCENT'
        );
      },
      undo: async (results) => {
        if (results['seedingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['areaSeededQuantity'].id
          );
        }
      },
    };
    ops.push(areaSeededQuantity);

    if (formData.winterKill) {
      const winterKillLog = {
        name: 'winterKillLog',
        do: async (results) => {
          return await farmosUtil.createWinterKillActivityLog(
            formData.winterKillDate,
            formData.location,
            formData.beds,
            results.plantAsset
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteWinterKillActivityLog(
            results['winterKillLog'].id
          );
        },
      };
      ops.push(winterKillLog);
    }

    const seedingLog = {
      name: 'seedingLog',
      do: async (results) => {
        return await farmosUtil.createSeedingLog(
          formData.date,
          formData.location,
          formData.beds,
          ['seeding', 'seeding_cover_crop'],
          results.plantAsset,
          [results.areaSeededQuantity]
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteSeedingLog(results['seedingLog'].id);
      },
    };
    ops.push(seedingLog);

    if (formData.seedApplicationEquipment.length > 0) {
      const seedApplicationDepthQuantity = {
        name: 'seedApplicationDepthQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'length',
            formData.seedApplicationDepth,
            'Depth',
            'INCHES'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(
            results['seedApplicationDepthQuantity'].id
          );
        },
      };
      ops.push(seedApplicationDepthQuantity);

      const seedApplicationSpeedQuantity = {
        name: 'seedApplicationSpeedQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'rate',
            formData.seedApplicationSpeed,
            'Speed',
            'MPH'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(
            results['seedApplicationSpeedQuantity'].id
          );
        },
      };
      ops.push(seedApplicationSpeedQuantity);

      const seedApplicationAreaQuantity = {
        name: 'seedApplicationAreaQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'ratio',
            formData.areaSeeded,
            'Area Seeded for Seed Application',
            'PERCENT'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(
            results['seedApplicationAreaQuantity'].id
          );
        },
      };
      ops.push(seedApplicationAreaQuantity);

      for (const equipmentName of formData.seedApplicationEquipment) {
        seedApplicationEquipmentAssets.push(equipmentMap.get(equipmentName));
      }

      // Loop for the number of passes specified in the form data.
      for (let i = 0; i < formData.seedApplicationPasses; i++) {
        const seedApplicationActivityLog = {
          // The name for each operation in the transaction must be unique.
          name: `seedApplicationActivityLog-${i}`,
          do: async (results) => {
            // To make the log name itself unique in farmOS, we append the pass number.
            const logName = `Seed Application Pass ${i + 1}`;
            return await farmosUtil.createSoilDisturbanceActivityLog(
              formData.date,
              formData.location,
              formData.beds,
              ['tillage', 'seeding_cover_crop'],
              results.plantAsset,
              [
                results.seedApplicationDepthQuantity,
                results.seedApplicationSpeedQuantity,
                results.seedApplicationAreaQuantity,
              ],
              seedApplicationEquipmentAssets,
              logName // Pass the unique name to the creation utility.
            );
          },
          undo: async (results) => {
            // Use the unique operation name to find the correct log to delete.
            await farmosUtil.deleteSoilDisturbanceActivityLog(
              results[`seedApplicationActivityLog-${i}`].id
            );
          },
        };
        ops.push(seedApplicationActivityLog);
      }
    }

    if (formData.seedIncorporationEquipment.length > 0) {
      const seedIncorporationDepthQuantity = {
        name: 'seedIncorporationDepthQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'length',
            formData.seedIncorporationDepth,
            'Depth',
            'INCHES'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(
            results['seedIncorporationDepthQuantity'].id
          );
        },
      };
      ops.push(seedIncorporationDepthQuantity);

      const seedIncorporationSpeedQuantity = {
        name: 'seedIncorporationSpeedQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'rate',
            formData.seedIncorporationSpeed,
            'Speed',
            'MPH'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(
            results['seedIncorporationSpeedQuantity'].id
          );
        },
      };
      ops.push(seedIncorporationSpeedQuantity);

      const seedIncorporationAreaQuantity = {
        name: 'seedIncorporationAreaQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'ratio',
            formData.areaSeeded,
            'Area Seeded for Seed Incorporation',
            'PERCENT'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(
            results['seedIncorporationAreaQuantity'].id
          );
        },
      };
      ops.push(seedIncorporationAreaQuantity);

      for (const equipmentName of formData.seedIncorporationEquipment) {
        seedIncorporationEquipmentAssets.push(equipmentMap.get(equipmentName));
      }

      // Loop for the number of passes specified in the form data.
      for (let i = 0; i < formData.seedIncorporationPasses; i++) {
        const seedIncorporationActivityLog = {
          // The name for each operation in the transaction must be unique.
          name: `seedIncorporationActivityLog-${i}`,
          do: async (results) => {
            // To make the log name itself unique in farmOS, we append the pass number.
            const logName = `Seed Incorporation Pass ${i + 1}`;
            return await farmosUtil.createSoilDisturbanceActivityLog(
              formData.date,
              formData.location,
              formData.beds,
              ['tillage', 'seeding_cover_crop'],
              results.plantAsset,
              [
                results.seedIncorporationDepthQuantity,
                results.seedIncorporationSpeedQuantity,
                results.seedIncorporationAreaQuantity,
              ],
              seedIncorporationEquipmentAssets,
              logName // Pass the unique name to the creation utility.
            );
          },
          undo: async (results) => {
            // Use the unique operation name to find the correct log to delete.
            await farmosUtil.deleteSoilDisturbanceActivityLog(
              results[`seedIncorporationActivityLog-${i}`].id
            );
          },
        };
        ops.push(seedIncorporationActivityLog);
      }
    }

    const result = await farmosUtil.runTransaction(ops);
    // Initialize arrays to hold the multiple activity logs that are now created.
    result.seedApplicationActivityLog = [];
    result.seedIncorporationActivityLog = [];
    // Loop through all the results from the transaction.
    for (const key in result) {
      // If a result key matches the seedApplication pattern, add it to our array.
      if (key.startsWith('seedApplicationActivityLog-')) {
        result.seedApplicationActivityLog.push(result[key]);
      }
      // If a result key matches the seedIncorporation pattern, add it to our array.
      if (key.startsWith('seedIncorporationActivityLog-')) {
        result.seedIncorporationActivityLog.push(result[key]);
      }
    }

    if (!formData.winterKill) {
      result['winterKillLog'] = null;
    }

    if (seedApplicationEquipmentAssets.length > 0) {
      result['seedApplicationEquipment'] = seedApplicationEquipmentAssets;
    } else {
      result['seedApplicationEquipment'] = null;
      result['seedApplicationDepthQuantity'] = null;
      result['seedApplicationSpeedQuantity'] = null;
      result['seedApplicationAreaQuantity'] = null;
      //result['seedApplicationActivityLog'] = null;
    }
    if (seedIncorporationEquipmentAssets.length > 0) {
      result['seedIncorporationEquipment'] = seedIncorporationEquipmentAssets;
    } else {
      result['seedIncorporationEquipment'] = null;
      result['seedIncorporationDepthQuantity'] = null;
      result['seedIncorporationSpeedQuantity'] = null;
      result['seedIncorporationAreaQuantity'] = null;
      //result['seedIncorporationActivityLog'] = null;
    }

    return result;
  } catch (error) {
    console.error('CoverCropSeeding: \n' + error.message);
    console.error(error);

    let errorMsg = 'Error creating cover crop seeding records.';

    for (const key of Object.keys(error.results)) {
      if (error.results[key] && error.results[key] != 'undone') {
        errorMsg +=
          '\n  Result of operation ' + key + ' could not be cleaned up.';
        if (
          error.results[key].attributes &&
          error.results[key].attributes.name
        ) {
          errorMsg += '\n   Manually delete log or asset with:';
          errorMsg += '\n     name: ' + error.results[key].attributes.name;
          // errorMsg += '\n     uuid: ' + error.results[key].id;
        } else {
          errorMsg += '\n   May be safely ignored';
          // errorMsg += '\n     uuid: ' + error.results[key].id;
        }
      }
    }

    throw Error(errorMsg, error);
  }
}

export const lib = {
  submitForm,
};
