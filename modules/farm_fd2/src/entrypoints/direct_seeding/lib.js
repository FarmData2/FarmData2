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
  let plantAsset = null;
  let bedFeetQuantity = null;
  let rowsPerBedQuantity = null;
  let bedWidthQuantity = null;
  let seedingLog = null;
  let equipmentAssets = [];
  let depthQuantity = null;
  let speedQuantity = null;
  let activityLog = null;

  try {
    const assetName = formData.seedingDate + '_ds_' + formData.cropName;

    plantAsset = await farmosUtil.createPlantAsset(
      assetName,
      formData.cropName,
      formData.comment
    );

    bedFeetQuantity = await farmosUtil.createStandardQuantity(
      'length',
      formData.bedFeet,
      'Bed Feet',
      'FEET'
    );

    rowsPerBedQuantity = await farmosUtil.createStandardQuantity(
      'ratio',
      formData.rowsPerBed,
      'Rows/Bed',
      'ROWS/BED'
    );

    bedWidthQuantity = await farmosUtil.createStandardQuantity(
      'length',
      formData.bedWidth,
      'Bed Width',
      'INCHES'
    );

    seedingLog = await farmosUtil.createSeedingLog(
      formData.seedingDate,
      formData.locationName,
      'seeding_direct',
      plantAsset,
      [bedFeetQuantity, rowsPerBedQuantity, bedWidthQuantity]
    );

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

    const equipmentMap = await farmosUtil.getEquipmentNameToAssetMap();
    for (const equipmentName of formData.equipment) {
      equipmentAssets.push(equipmentMap.get(equipmentName));
    }

    activityLog = await farmosUtil.createSoilDisturbanceActivityLog(
      formData.seedingDate,
      formData.locationName,
      'activity_soil_disturbance_tillage',
      plantAsset,
      [depthQuantity, speedQuantity],
      equipmentAssets
    );

    return {
      plantAsset: plantAsset,
      bedFeetQuantity: bedFeetQuantity,
      rowsPerBedQuantity: rowsPerBedQuantity,
      bedWidthQuantity: bedWidthQuantity,
      seedingLog: seedingLog,
      depthQuantity: depthQuantity,
      speedQuantity: speedQuantity,
      equipment: equipmentAssets,
      activityLog: activityLog,
    };
  } catch (error) {
    console.log('DirectSeeding: \n' + error.message);
    console.log(error);

    if (seedingLog) {
      await farmosUtil.deleteSeedingLog(seedingLog.id);
    }

    if (rowsPerBedQuantity) {
      await farmosUtil.deleteStandardQuantity(rowsPerBedQuantity.id);
    }

    if (bedWidthQuantity) {
      await farmosUtil.deleteStandardQuantity(bedWidthQuantity.id);
    }

    if (bedFeetQuantity) {
      await farmosUtil.deleteStandardQuantity(bedFeetQuantity.id);
    }

    if (activityLog) {
      // delete this.
    }

    if (depthQuantity) {
      await farmosUtil.deleteStandardQuantity(depthQuantity.id);
    }

    if (speedQuantity) {
      await farmosUtil.deleteStandardQuantity(speedQuantity.id);
    }

    if (plantAsset) {
      await farmosUtil.deletePlantAsset(plantAsset.id);
    }

    throw Error('Error creating direct seeding.', error);
  }
}
