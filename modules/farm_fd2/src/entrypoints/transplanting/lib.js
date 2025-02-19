import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * the transplanted trays.
 *
 * @param {Object} formData the form data from the transplanting form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   parents: [ {asset--plant}, ... ],
 *   transplantingPlantAsset: {asset--plant},
 *   trayInventoryQuantities: [ {quantity--standard}, ... ],
 *   bedFeetQuantity: {quantity--standard},
 *   bedWidthQuantity: {quantity--standard},
 *   rowsPerBedQuantity: {quantity--standard},
 *   rowFeetQuantity: {quantity--standard},
 *   transplantingLog: {log--activity},
 *   depthQuantity: {quantity--standard},
 *   speedQuantity: {quantity--standard},
 *   equipmentAssets: [ {asset--equipment}, ... ],
 *   soilDisturbanceLog: {log--activity},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  // Find the plant asset for each picked tray seeding,
  try {
    const ops = [];
    const parentsArray = [];

    const parents = {
      name: 'parents',
      do: async () => {
        for (const { data } of formData.picked.values()) {
          const parent = await farmosUtil.getPlantAsset(data.asset_uuid);
          parentsArray.push(parent);
        }

        return parentsArray;
      },
      undo: () => {},
    };
    ops.push(parents);

    // One quantity for each picked tray seeding as trays inventory decrement
    // on original tray seeding plant asset.
    const trayInventoryQuantities = {
      name: 'trayInventoryQuantities',
      do: async (results) => {
        const trayInventoryQuantitiesArray = [];
        for (const [i, { trays }] of formData.picked.entries()) {
          const trayQuantity = await farmosUtil.createStandardQuantity(
            'count',
            trays,
            'Trays',
            'TRAYS',
            results.parents[i],
            'decrement'
          );

          trayInventoryQuantitiesArray.push(trayQuantity);

          const trayInvenotry = farmosUtil.getAssetInventory(
            results.parents[i],
            'count',
            'TRAYS'
          );

          // All of the trays in the planting have been transplanted.
          if (trays === trayInvenotry) {
            await farmosUtil.archivePlantAsset(results.parents[i].id, true);
          }
        }

        return trayInventoryQuantitiesArray;
      },
      undo: async (results) => {
        for (const trayQuantity of results.trayInventoryQuantities) {
          if (results['transplantingLog'] != 'undone') {
            await farmosUtil.deleteStandardQuantity(trayQuantity.id);
          }

          // The inventory decrement was deleted so make sure the asset
          // is not archived.
          await farmosUtil.archivePlantAsset(trayQuantity.parent.id, false);
        }
      },
    };
    ops.push(trayInventoryQuantities);

    const transplantingPlantAsset = {
      name: 'transplantingPlantAsset',
      do: async (results) => {
        return await farmosUtil.createPlantAsset(
          formData.transplantingDate,
          formData.cropName,
          formData.comment,
          results.parents
        );
      },
      undo: async (results) => {
        await farmosUtil.deletePlantAsset(
          results['transplantingPlantAsset'].id
        );
      },
    };
    ops.push(transplantingPlantAsset);

    const transplantingBedFeetQuantity = {
      name: 'transplantingBedFeetQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'length',
          formData.bedFeet,
          'Bed Feet',
          'FEET'
        );
      },
      undo: async (results) => {
        if (results['transplantingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['transplantingBedFeetQuantity'].id
          );
        }
      },
    };
    ops.push(transplantingBedFeetQuantity);

    const transplantingBedWidthQuantity = {
      name: 'transplantingBedWidthQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'length',
          formData.bedWidth,
          'Bed Width',
          'INCHES'
        );
      },
      undo: async (results) => {
        if (results['transplantingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['transplantingBedWidthQuantity'].id
          );
        }
      },
    };
    ops.push(transplantingBedWidthQuantity);

    const transplantingRowsPerBedQuantity = {
      name: 'transplantingRowsPerBedQuantity',
      do: async () => {
        return await farmosUtil.createStandardQuantity(
          'ratio',
          formData.rowsPerBed,
          'Rows/Bed',
          'ROWS/BED'
        );
      },
      undo: async (results) => {
        if (results['transplantingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['transplantingRowsPerBedQuantity'].id
          );
        }
      },
    };
    ops.push(transplantingRowsPerBedQuantity);

    const transplantingRowFeetQuantity = {
      name: 'transplantingRowFeetQuantity',
      do: async (results) => {
        return await farmosUtil.createStandardQuantity(
          'length',
          formData.bedFeet * formData.rowsPerBed,
          'Row Feet',
          'FEET',
          results.transplantingPlantAsset,
          'increment'
        );
      },
      undo: async (results) => {
        if (results['transplantingLog'] != 'undone') {
          await farmosUtil.deleteStandardQuantity(
            results['transplantingRowFeetQuantity'].id
          );
        }
      },
    };
    ops.push(transplantingRowFeetQuantity);

    const transplantingLog = {
      name: 'transplantingLog',
      do: async (results) => {
        return await farmosUtil.createTransplantingActivityLog(
          formData.transplantingDate,
          formData.location,
          formData.beds,
          results.transplantingPlantAsset,
          [
            results.transplantingBedFeetQuantity,
            results.transplantingBedWidthQuantity,
            results.transplantingRowsPerBedQuantity,
            results.transplantingRowFeetQuantity,
            ...results.trayInventoryQuantities,
          ]
        );
      },
      undo: async (results) => {
        await farmosUtil.deleteTransplantingActivityLog(
          results['transplantingLog'].id
        );
      },
    };
    ops.push(transplantingLog);

    // Create the soil disturbance log if equipment is selected
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

      // Get the asset--equipment objects for the chosen equipment
      const equipmentAssets = {
        name: 'equipmentAssets',
        do: async () => {
          const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
          const equipmentAssetsArray = [];
          for (const equipmentName of formData.equipment) {
            equipmentAssetsArray.push(equipmentMap.get(equipmentName));
          }
          return equipmentAssetsArray;
        },
        undo: async () => {},
      };
      ops.push(equipmentAssets);

      const activityLog = {
        name: 'activityLog',
        do: async (results) => {
          return await farmosUtil.createSoilDisturbanceActivityLog(
            formData.transplantingDate,
            formData.location,
            formData.beds,
            ['tillage', 'transplanting'],
            results.transplantingPlantAsset,
            [
              results.depthQuantity,
              results.speedQuantity,
              results.transplantingBedFeetQuantity,
            ],
            results.equipmentAssets
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

    const results = await farmosUtil.runTransaction(ops);

    if (formData.equipment.length == 0) {
      results['equipmentAssets'] = null;
      results['depthQuantity'] = null;
      results['speedQuantity'] = null;
      results['activityLog'] = null;
    }

    return results;
  } catch (error) {
    console.error('Transplanting: \n' + error.message);
    console.error(error);

    let errorMsg = 'Error creating transplanting.';

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

export const lib = {
  submitForm,
};
