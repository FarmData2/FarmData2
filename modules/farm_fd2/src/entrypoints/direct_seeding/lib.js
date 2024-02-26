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
 *   area: {quantity--standard},
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
  let areaQuantity = null;
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
      'FEET',
      plantAsset,
      'increment'
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
      formData.beds,
      ['seeding', 'seeding_direct'],
      plantAsset,
      [bedFeetQuantity, rowsPerBedQuantity, bedWidthQuantity]
    );

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
        formData.seedingDate,
        formData.locationName,
        formData.beds,
        ['tillage', 'seeding_direct'],
        plantAsset,
        [depthQuantity, speedQuantity, areaQuantity],
        equipmentAssets
      );
    }

    return {
      plantAsset: plantAsset,
      bedFeetQuantity: bedFeetQuantity,
      rowsPerBedQuantity: rowsPerBedQuantity,
      bedWidthQuantity: bedWidthQuantity,
      seedingLog: seedingLog,
      depthQuantity: depthQuantity,
      speedQuantity: speedQuantity,
      areaQuantity: areaQuantity,
      equipment: equipmentAssets,
      activityLog: activityLog,
    };
  } catch (error) {
    console.log('DirectSeeding: \n' + error.message);
    console.log(error);

    /*
     * Attempt to delete any of the records that were created.  It is likely
     * that if there was an error creating the records then there will
     * be errors deleting them too.  So we try/catch those and swallow
     * the exceptions and just emit a new error at the end.
     */

    if (seedingLog) {
      try {
        await farmosUtil.deleteSeedingLog(seedingLog.id);
      } catch (error) {
        console.log('Unable to delete seeding log: ' + seedingLog.id);
      }
    }

    if (rowsPerBedQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(rowsPerBedQuantity.id);
      } catch (error) {
        console.log(
          'Unable to delete rowsPerBedQuantity: ' + rowsPerBedQuantity.id
        );
      }
    }

    if (bedWidthQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(bedWidthQuantity.id);
      } catch (error) {
        console.log(
          'Unable to delete bedWidthQuantity: ' + bedWidthQuantity.id
        );
      }
    }

    if (bedFeetQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(bedFeetQuantity.id);
      } catch (error) {
        console.log('Unable to delete bedFeetQuantity: ' + bedFeetQuantity.id);
      }
    }

    /*
     * Don't need to do the activity log, because if it didn't work
     * it wouldn't have been created and if it did work then everything
     * worked.
     */

    if (depthQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(depthQuantity.id);
      } catch (error) {
        console.log('Unable to delete depthQuantity: ' + depthQuantity.id);
      }
    }

    if (speedQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(speedQuantity.id);
      } catch (error) {
        console.log('Unable to delete speedQuantity: ' + speedQuantity.id);
      }
    }

    if (areaQuantity) {
      try {
        await farmosUtil.deleteStandardQuantity(areaQuantity.id);
      } catch (error) {
        console.log('Unable to delete areaQuantity: ' + areaQuantity.id);
      }
    }

    if (plantAsset) {
      try {
        await farmosUtil.deletePlantAsset(plantAsset.id);
      } catch (error) {
        console.log('Unable to delete plantAsset: ' + plantAsset.id);
      }
    }

    throw Error('Error creating direct seeding.', error);
  }
}
