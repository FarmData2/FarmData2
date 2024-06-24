import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a soil disturbance
 *
 * @param {Object} form the form containing the data from the entry point.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   equipment: [ {asset--equipment} ],
 *   archivedPlants: [ {asset--plant} ],
 *   depth: {quantity--standard},
 *   speed: {quantity--standard},
 *   area: {quantity--standard},
 *   activityLog: [ {log--activity} ],
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
async function submitForm(formData) {
  try {
    let ops = [];
    const equipmentAssets = [];

    const archivedPlants = {
      name: 'archivedPlants',
      do: async () => {
        if (formData.termination) {
          let archivedPlants = [];
          for (const plantID of formData.terminatedPlants) {
            archivedPlants.push(
              await farmosUtil.archivePlantAsset(plantID, true)
            );
          }
          return archivedPlants;
        }
        return null;
      },
      undo: async () => {
        for (const plantID of formData.terminatedPlants) {
          await farmosUtil.archivePlantAsset(plantID, false);
        }
      },
    };
    ops.push(archivedPlants);

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

    const areaQuantity = {
      name: 'areaQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'ratio',
          formData.area,
          'Area',
          'PERCENT'
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteStandardQuantity(results['areaQuantity'].id);
      },
    };
    ops.push(areaQuantity);

    const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
    for (const equipmentName of formData.equipment) {
      equipmentAssets.push(equipmentMap.get(equipmentName));
    }

    const activityLog = {
      name: 'activityLog',
      do: async (results) => {
        let logs = [];
        for (let i = 0; i < formData.passes; i++) {
          logs.push(
            await farmosUtil.createSoilDisturbanceActivityLog(
              formData.date,
              formData.location,
              formData.beds,
              ['tillage'],
              results.archivedPlants,
              [
                results.depthQuantity,
                results.speedQuantity,
                results.areaQuantity,
              ],
              equipmentAssets
            )
          );
        }
        return logs;
      },
      undo: async (results) => {
        for (const log of results['activityLog']) {
          await farmosUtil.deleteSoilDisturbanceActivityLog(log.id);
        }
      },
    };
    ops.push(activityLog);

    const result = await farmosUtil.runTransaction(ops);
    result['equipment'] = equipmentAssets;

    return result;
  } catch (error) {
    console.error('SoilDisturbance: \n' + error.message);
    console.error(error);

    let errorMsg = 'Error creating Soil Disturbance records.';

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
