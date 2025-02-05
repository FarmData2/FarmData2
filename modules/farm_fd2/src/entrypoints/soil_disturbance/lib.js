import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (quantities and logs) to represent
 * a soil disturbance
 *
 * @param {Object} form The form containing the data from the entry point.
 * @returns {Promise} A promise that resolves when the records are successfully created.
 * The returned value is an object containing the quantities and logs that
 * were sent to the server. This object has the following properties based on whether
 * an active plant assets are involved in the soil disturbance event:
 *
 * - **If no active plant assets are involved:** `i` represents the number of passes.
 *
 * ```javascript
 * {
 *   equipment: [ {asset--equipment} ],
 *   depth(i): {quantity--standard},
 *   speed(i): {quantity--standard},
 *   area(i): {quantity--standard},
 *   activityLog(i): {log--activity},
 * }
 * ```
 *
 * - **If active plant assets are involved:** `i` represents the number of the plant asset,
 *   and `j` represents number of passes for the `i` plant asset.
 *
 * ```javascript
 * {
 *   equipment: [ {asset--equipment} ],
 *   terminationLog(i): {log--activity}, // Present if the soil disturbance event is also a termination event.
 *   affectedPlants: [ {asset--plant} ],
 *   depth(i, j): {quantity--standard},
 *   speed(i, j): {quantity--standard},
 *   area(i, j): {quantity--standard},
 *   activityLog(i, j): {log--activity},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
async function submitForm(formData) {
  try {
    let ops = [];
    const equipmentAssets = [];

    // Group by plant assets and save its corresponding beds to terminate
    let plantAssets = {};
    formData.picked.forEach((entry) => {
      const { uuid, bed } = entry.row;

      if (!plantAssets[uuid]) {
        plantAssets[uuid] = {
          beds: [],
        };
      }

      if (bed !== 'N/A') {
        plantAssets[uuid].beds.push(bed);
      }
    });
    plantAssets = Object.entries(plantAssets); // [[uuid, {beds}]

    // if no active plant assets exist
    if (plantAssets.length === 0) {
      const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
      for (const equipmentName of formData.equipment) {
        equipmentAssets.push(equipmentMap.get(equipmentName));
      }

      for (let i = 0; i < formData.passes; i++) {
        const depthQuantity = {
          name: 'depthQuantity' + i,
          do: async () => {
            return await farmosUtil.createStandardQuantity(
              'length',
              formData.depth,
              'Depth',
              'INCHES'
            );
          },
          undo: async (results) => {
            await farmosUtil.deleteStandardQuantity(
              results['depthQuantity' + i].id
            );
          },
        };
        ops.push(depthQuantity);

        const speedQuantity = {
          name: 'speedQuantity' + i,
          do: async () => {
            return await farmosUtil.createStandardQuantity(
              'rate',
              formData.speed,
              'Speed',
              'MPH'
            );
          },
          undo: async (results) => {
            await farmosUtil.deleteStandardQuantity(
              results['speedQuantity' + i].id
            );
          },
        };
        ops.push(speedQuantity);

        const areaQuantity = {
          name: 'areaQuantity' + i,
          do: async () => {
            return await farmosUtil.createStandardQuantity(
              'ratio',
              formData.area,
              'Area',
              'PERCENT'
            );
          },
          undo: async (results) => {
            await farmosUtil.deleteStandardQuantity(
              results['areaQuantity' + i].id
            );
          },
        };
        ops.push(areaQuantity);

        const activityLog = {
          name: 'activityLog' + i,
          do: async (results) => {
            return await farmosUtil.createSoilDisturbanceActivityLog(
              formData.date,
              formData.location,
              formData.beds,
              formData.termination ? ['tillage', 'termination'] : ['tillage'],
              null,
              [
                results['depthQuantity' + i],
                results['speedQuantity' + i],
                results['areaQuantity' + i],
              ],
              equipmentAssets,
              'Pass ' +
                (i + 1) +
                ' of ' +
                formData.passes +
                '. ' +
                formData.comment
            );
          },
          undo: async (results) => {
            await farmosUtil.deleteSoilDisturbanceActivityLog(
              results['activityLog' + i].id
            );
          },
        };
        ops.push(activityLog);
      }
    } else {
      // if we have a active plant asset, then create a termination log (optional)
      // and a soil disturbance log (required) per plant asset

      const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
      for (const equipmentName of formData.equipment) {
        equipmentAssets.push(equipmentMap.get(equipmentName));
      }

      for (let i = 0; i < plantAssets.length; i++) {
        const [uuid, { beds }] = plantAssets[i];

        if (formData.termination) {
          const terminationLog = {
            name: 'terminationLog' + i,
            do: async () => {
              return await farmosUtil.createSoilDisturbanceTerminationLog(
                formData.date,
                formData.location,
                beds.length > 0 ? beds : [],
                await farmosUtil.getPlantAsset(uuid)
              );
            },
            undo: async (results) => {
              await farmosUtil.deleteSoilDisturbanceTerminationLog(
                results['terminationLog' + i].id
              );
            },
          };
          ops.push(terminationLog);
        }

        for (let j = 0; j < formData.passes; j++) {
          const depthQuantity = {
            name: 'depthQuantity' + i + ' ' + j,
            do: async () => {
              return await farmosUtil.createStandardQuantity(
                'length',
                formData.depth,
                'Depth',
                'INCHES'
              );
            },
            undo: async (results) => {
              await farmosUtil.deleteStandardQuantity(
                results['depthQuantity' + i + ' ' + j].id
              );
            },
          };
          ops.push(depthQuantity);

          const speedQuantity = {
            name: 'speedQuantity' + i + ' ' + j,
            do: async () => {
              return await farmosUtil.createStandardQuantity(
                'rate',
                formData.speed,
                'Speed',
                'MPH'
              );
            },
            undo: async (results) => {
              await farmosUtil.deleteStandardQuantity(
                results['speedQuantity' + i + ' ' + j].id
              );
            },
          };
          ops.push(speedQuantity);

          const areaQuantity = {
            name: 'areaQuantity' + i + ' ' + j,
            do: async () => {
              return await farmosUtil.createStandardQuantity(
                'ratio',
                formData.area,
                'Area',
                'PERCENT'
              );
            },
            undo: async (results) => {
              await farmosUtil.deleteStandardQuantity(
                results['areaQuantity' + i + ' ' + j].id
              );
            },
          };
          ops.push(areaQuantity);

          const activityLog = {
            name: 'activityLog' + i + ' ' + j,
            do: async (results) => {
              return await farmosUtil.createSoilDisturbanceActivityLog(
                formData.date,
                formData.location,
                beds.length > 0 ? beds : [],
                formData.termination ? ['tillage', 'termination'] : ['tillage'],
                await farmosUtil.getPlantAsset(uuid),
                [
                  results['depthQuantity' + i + ' ' + j],
                  results['speedQuantity' + i + ' ' + j],
                  results['areaQuantity' + i + ' ' + j],
                ],
                equipmentAssets,
                'Pass ' +
                  (j + 1) +
                  ' of ' +
                  formData.passes +
                  '. ' +
                  formData.comment
              );
            },
            undo: async (results) => {
              await farmosUtil.deleteSoilDisturbanceActivityLog(
                results['activityLog' + i + ' ' + j].id
              );
            },
          };
          ops.push(activityLog);
        }
      }
    }

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
