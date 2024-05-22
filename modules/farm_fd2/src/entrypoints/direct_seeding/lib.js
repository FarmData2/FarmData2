import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a direct seeding.
 *
 * @param {Object} formData the form data from the direct seeding form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   plantAsset: {asset--plant},
 *   bedFeet: {quantity--standard},
 *   rowsPerBed: {quantity--standard},
 *   rowFeet: {quantity--standard},
 *   bedWidth: {quantity--standard},
 *   seedingLog: {log--seeding},
 *   equipment: [ {asset--equipment} ],
 *   depth: {quantity--standard},
 *   speed: {quantity--standard},
 *   activityLog: {log--activity},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  try {
    const ops = [];
    const equipmentAssets = [];

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
    ops.push(plantAsset);

    const bedFeetQuantity = {
      name: 'bedFeetQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'length',
          formData.bedFeet,
          'Bed Feet',
          'FEET'
        );
      },
      undo: async (results) => {
        if (results['seedingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['bedFeetQuantity'].id
          );
        }
      },
    };
    ops.push(bedFeetQuantity);

    const rowsPerBedQuantity = {
      name: 'rowsPerBedQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'ratio',
          formData.rowsPerBed,
          'Rows/Bed',
          'ROWS/BED'
        );
      },
      undo: async (results) => {
        if (results['seedingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['rowsPerBedQuantity'].id
          );
        }
      },
    };
    ops.push(rowsPerBedQuantity);

    const rowFeetQuantity = {
      name: 'rowFeetQuantity',
      do: async (results) => {
        return await farmosUtil.createStandardQuantity(
          'length',
          formData.bedFeet * formData.rowsPerBed,
          'Row Feet',
          'FEET',
          results.plantAsset,
          'increment'
        );
      },
      undo: async (results) => {
        if (results['seedingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['rowFeetQuantity'].id
          );
        }
      },
    };
    ops.push(rowFeetQuantity);

    const bedWidthQuantity = {
      name: 'bedWidthQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'length',
          formData.bedWidth,
          'Bed Width',
          'INCHES'
        );
      },
      undo: async (results) => {
        if (results['seedingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['bedWidthQuantity'].id
          );
        }
      },
    };
    ops.push(bedWidthQuantity);

    const seedingLog = {
      name: 'seedingLog',
      do: async (results) => {
        return await farmosUtil.createSeedingLog(
          formData.seedingDate,
          formData.locationName,
          formData.beds,
          ['seeding', 'seeding_direct'],
          results.plantAsset,
          [
            results.bedFeetQuantity,
            results.rowsPerBedQuantity,
            results.rowFeetQuantity,
            results.bedWidthQuantity,
          ]
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteSeedingLog(results['seedingLog'].id);
      },
    };
    ops.push(seedingLog);

    if (formData.equipment.length > 0) {
      const depthQuantity = {
        name: 'depthQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'length',
            formData.depth,
            'Depth',
            'INCHES'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(results['depthQuantity'].id);
        },
      };
      ops.push(depthQuantity);

      const speedQuantity = {
        name: 'speedQuantity',
        do: async () => {
          return await farmosUtil.createStandardQuantity(
            'rate',
            formData.speed,
            'Speed',
            'MPH'
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteStandardQuantity(results['speedQuantity'].id);
        },
      };
      ops.push(speedQuantity);

      const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
      for (const equipmentName of formData.equipment) {
        equipmentAssets.push(equipmentMap.get(equipmentName));
      }

      const activityLog = {
        name: 'activityLog',
        do: async (results) => {
          return await farmosUtil.createSoilDisturbanceActivityLog(
            formData.seedingDate,
            formData.locationName,
            formData.beds,
            ['tillage', 'seeding_direct'],
            results.plantAsset,
            [results.depthQuantity, results.speedQuantity],
            equipmentAssets
          );
        },
        undo: async (results) => {
          await farmosUtil.deleteSoilDisturbanceActivityLog(
            results['activityLog'].id
          );
        },
      };
      ops.push(activityLog);
    }

    const result = await farmosUtil.runTransaction(ops);
    if (equipmentAssets.length > 0) {
      result['equipment'] = equipmentAssets;
    } else {
      result['equipment'] = null;
      result['depthQuantity'] = null;
      result['speedQuantity'] = null;
      result['activityLog'] = null;
    }

    return result;
  } catch (error) {
    console.error('DirectSeeding: \n' + error.message);
    console.error(error);

    let errorMsg = 'Error creating direct seeding.';

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
