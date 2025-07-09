/*
 * Utility functions for getting and working with seeding.
 */

import dayjs from 'dayjs';
import { getFarmOSInstance } from './farmosUtil.core.js';
import { getCropIdToTermMap } from './farmosUtil.crops.js';
import {
  getPlantingLocationObjects,
  getLogCategoryObjects,
  getQuantityObjects,
} from './farmosUtil.utilities.js';

/**
 * Create a new seeding log.
 *
 * @param {string} seedingDate the date of the seeding
 * @param {string} locationName the name of the location where the seeding occurred.
 * @param {Array<string>} bedNames the names of the bed(s) where the seeding occurred.
 * @param {Array<string>} logCategories the log categories associated with this log.
 * @param {Object} plantAsset the plant asset created by the seeding.
 * @param {Array<Object>} [quantities] an array of quantity objects.
 * @returns {Object} the new seeding log.
 * @throws {Error} if unable to create the seeding log.
 *
 * @category Seeding
 */
export async function createSeedingLog(
  seedingDate,
  locationName,
  bedNames,
  logCategories,
  plantAsset,
  quantities
) {
  // Helper functions from the utilities module.
  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const logCategoriesArray = await getLogCategoryObjects(logCategories);
  const quantitiesArray = getQuantityObjects(quantities);

  const cropIdToNameMap = await getCropIdToTermMap();
  let logName = dayjs(seedingDate).format('YYYY-MM-DD');
  if (logCategories.includes('seeding_tray')) {
    logName += '_ts_';
  } else if (logCategories.includes('seeding_direct')) {
    logName += '_ds_';
  } else if (logCategories.includes('seeding_cover_crop')) {
    logName += '_cs_';
  }

  logName += plantAsset.relationships.plant_type
    .map((crop) => cropIdToNameMap.get(crop.id).attributes.name)
    .join('_');

  const seedingLogData = {
    type: 'log--seeding',
    attributes: {
      name: logName,
      timestamp: dayjs(seedingDate).format(),
      status: 'done',
      is_movement: true,
      purchase_date: dayjs(seedingDate).format(),
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
      quantity: quantitiesArray,
    },
  };

  const farm = await getFarmOSInstance();
  const seedingLog = farm.log.create(seedingLogData);
  await farm.log.send(seedingLog);

  return seedingLog;
}

/**
 * Get the seeding log with the specified id.
 *
 * @param {string} seedingLogId the id of the seeding log.
 * @returns {Object} the seeding log with the specified id.
 * @throws {Error} if unable to get the seeding log.
 *
 * @category Seeding
 */
export async function getSeedingLog(seedingLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--seeding', id: seedingLogId },
  });
  return results.data[0];
}

/**
 * Delete the seeding log with the specified id.
 *
 * @param {string} seedingLogId the id of the seeding log.
 * @returns {Object} the deleted seeding log.
 * @throws {Error} if unable to delete the seeding log.
 *
 * @category Seeding
 */
export async function deleteSeedingLog(seedingLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('seeding', seedingLogId);
    return result;
  } catch (error) {
    console.error('deleteSeedingLog:');
    console.error('Unable to delete seeding log with id: ' + seedingLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
