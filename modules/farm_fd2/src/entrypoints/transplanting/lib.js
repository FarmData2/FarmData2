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
 *   transplantingAsset: {asset--plant},
 *   trayInventoryQuantities: [ {quantity--standard}, ... ],
 *   bedFeetQuantity: {quantity--standard},
 *   bedWidthQuantity: {quantity--standard},
 *   rowsPerBedQuantity: {quantity--standard},
 *   rowFeetQuantity: {quantity--standard},
 *   transplantingLog: {log--activity},
 *   depthQuantity: {quantity--standard},
 *   speedQuantity: {quantity--standard},
 *   areaQuantity: {quantity--standard},
 *   equipment: [ {asset--equipment}, ... ],
 *   soilDisturbanceLog: {log--activity},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  let newPlantAsset = null;
  let trayInventoryQuantities = [];
  let transplantingBedFeetQuantity = null;
  let transplantingBedWidthQuantity = null;
  let transplantingRowsPerBedQuantity = null;
  let transplantingRowFeetQuantity = null;
  let transplantingLog = null;
  let equipmentAssets = [];
  let depthQuantity = null;
  let speedQuantity = null;
  let areaQuantity = null;
  let activityLog = null;

  // Build the per picked trays data needed to record the transplanting.
  try {
    const parents = [];
    for (const row of formData.picked) {
      // Find the plant asset for each picked tray seeding,
      // These will be the parent(s) of the new plant asset for the transplanted trays.
      const parent = await farmosUtil.getPlantAsset(row.data.asset_uuid);
      parents.push(parent);

      // One quantity for each picked tray seeding as inventory decrement on original asset.
      const trayQuantity = await farmosUtil.createStandardQuantity(
        'count',
        row.trays,
        'Trays',
        'TRAYS',
        parent,
        'decrement'
      );
      trayInventoryQuantities.push(trayQuantity);

      // TODO: archive the original plant asset if inventory == 0 ?????
    }

    // Create the plant asset representing the transplanted crop.
    // Include the original tray seeded plant assets as parents.
    const assetName = formData.transplantingDate + '_' + formData.cropName;

    newPlantAsset = await farmosUtil.createPlantAsset(
      assetName,
      formData.cropName,
      formData.comment,
      parents
    );

    // Create the transplanting activity log.
    // Quantities from the form with Row Feet as inventory increment on new asset.
    transplantingBedFeetQuantity = await farmosUtil.createStandardQuantity(
      'length',
      formData.bedFeet,
      'Bed Feet',
      'FEET'
    );
    transplantingBedWidthQuantity = await farmosUtil.createStandardQuantity(
      'length',
      formData.bedWidth,
      'Bed Width',
      'INCHES'
    );
    transplantingRowsPerBedQuantity = await farmosUtil.createStandardQuantity(
      'ratio',
      formData.rowsPerBed,
      'Rows/Bed',
      'ROWS/BED'
    );
    transplantingRowFeetQuantity = await farmosUtil.createStandardQuantity(
      'length',
      formData.bedFeet * formData.rowsPerBed,
      'Row Feet',
      'FEET',
      newPlantAsset,
      'increment'
    );

    transplantingLog = await farmosUtil.createTransplantingActivityLog(
      formData.transplantingDate,
      formData.location,
      formData.beds,
      newPlantAsset,
      [
        transplantingBedFeetQuantity,
        transplantingBedWidthQuantity,
        transplantingRowsPerBedQuantity,
        transplantingRowFeetQuantity,
        ...trayInventoryQuantities,
      ]
    );

    // Create the soil disturbance log if equipment is selected
    if (formData.equipment.length > 0) {
      depthQuantity = await farmosUtil.createStandardQuantity(
        'length',
        formData.depth,
        'Depth',
        'INCHES'
      );

      speedQuantity = await farmosUtil.createStandardQuantity(
        'rate',
        formData.speed,
        'Speed',
        'MPH'
      );

      areaQuantity = await farmosUtil.createStandardQuantity(
        'ratio',
        formData.area,
        'Area',
        'PERCENT'
      );

      const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
      for (const equipmentName of formData.equipment) {
        equipmentAssets.push(equipmentMap.get(equipmentName));
      }

      activityLog = await farmosUtil.createSoilDisturbanceActivityLog(
        formData.transplantingDate,
        formData.location,
        formData.beds,
        ['tillage', 'seeding_direct'],
        newPlantAsset,
        [depthQuantity, speedQuantity, areaQuantity],
        equipmentAssets
      );
    }

    return {
      transplantingAsset: newPlantAsset,
      trayInventoryQuantities: trayInventoryQuantities,
      bedFeetQuantity: transplantingBedFeetQuantity,
      bedWidthQuantity: transplantingBedWidthQuantity,
      rowsPerBedQuantity: transplantingRowsPerBedQuantity,
      rowFeetQuantity: transplantingRowFeetQuantity,
      transplantingLog: transplantingLog,
      depthQuantity: depthQuantity,
      speedQuantity: speedQuantity,
      areaQuantity: areaQuantity,
      equipment: equipmentAssets,
      soilDisturbanceLog: activityLog,
    };
  } catch (error) {
    console.error('Transplanting: \n' + error.message);
    console.error(error);

    /*
     * Attempt to delete any of the records that were created.  It is likely
     * that if there was an error creating the records then there will
     * be errors deleting them too.  So we try/catch those and swallow
     * the exceptions and just emit a new error at the end.
     */



    // TODO: BUILD A CLEANUP FUNCTION in farmosUtil.
    // - push delete functions to an array as quantities, logs, assets
    // are created, then function runs those functions in reverse order.


    throw Error('Error creating transplanting.', error);
  }
}
