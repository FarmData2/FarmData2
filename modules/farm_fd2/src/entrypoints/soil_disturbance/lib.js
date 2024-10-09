import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a soil disturbance
 *
 * @param {Object} form the form containing the data from the entry point.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the properties shown below
 * where i indicates passes:
 * ```Javascript
 * {
 *   equipment: [ {asset--equipment} ],
 *   affectedPlants: [ {asset--plant} ],
 *   depth(i): {quantity--standard},
 *   speed(i): {quantity--standard},
 *   area(i): {quantity--standard},
 *   activityLog(i): {log--activity},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
async function submitForm(formData) {
  try {
    let ops = [];
    const equipmentAssets = [];

    const affectedPlants = {
      name: 'affectedPlants',
      do: async () => {
        let affectedPlants = [];
        const bedsByUUID = new Map();
        const archivedPlants = [];

        // Group picked beds by plant UUID
        for (const entry of formData.picked) {
          const { uuid, bed } = entry.row;

          // If the plant has bed set as "N/A", archive it directly
          if (bed === 'N/A') {
            await farmosUtil.archivePlantAsset(uuid, true);
            archivedPlants.push(uuid);
            continue;
          }

          if (!bedsByUUID.has(uuid)) {
            bedsByUUID.set(uuid, []);
          }
          bedsByUUID.get(uuid).push(bed);
        }

        // Iterate over each plant UUID and handle termination
        for (const [uuid, pickedBeds] of bedsByUUID.entries()) {
          const plantAsset = await farmosUtil.getPlantAsset(uuid);

          // If the plant has no beds after fetching, archive it directly
          if (
            plantAsset.beds.length === pickedBeds.length &&
            plantAsset.beds.every((bed) => pickedBeds.includes(bed))
          ) {
            // If all beds of the plant are picked, archive the plant asset
            await farmosUtil.archivePlantAsset(uuid, true);
            archivedPlants.push(uuid);
          } else {
            // Otherwise, remove the selected beds from the plant asset
            plantAsset.beds = plantAsset.beds.filter(
              (bed) => !pickedBeds.includes(bed)
            );
            await farmosUtil.updatePlantAsset(plantAsset); // Assuming updatePlantAsset exists
          }
          affectedPlants.push(plantAsset);
        }

        return { affectedPlants, archivedPlants, bedsByUUID };
      },
      undo: async (results) => {
        const { archivedPlants, bedsByUUID } = results;

        // Unarchive any plant assets that were archived during the "do" function
        for (const uuid of archivedPlants) {
          await farmosUtil.archivePlantAsset(uuid, false);
        }

        // Restore the original beds for each plant asset
        for (const [uuid, pickedBeds] of bedsByUUID.entries()) {
          const plantAsset = await farmosUtil.getPlantAsset(uuid);

          // Add back the beds that were removed during the "do" function
          for (const bed of pickedBeds) {
            if (!plantAsset.beds.includes(bed)) {
              plantAsset.beds.push(bed);
            }
          }

          // Update the plant asset with the restored beds
          await farmosUtil.updatePlantAsset(plantAsset);
        }
      },
    };
    ops.push(affectedPlants);

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
            results.affectedPlants,
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
