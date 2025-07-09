/*
 * Utility functions for getting and working with winterKill.
 */

import dayjs from 'dayjs';
import { getFarmOSInstance } from './farmosUtil.core.js';
import { getCropIdToTermMap } from './farmosUtil.crops.js';
import {
  getPlantingLocationObjects,
  getLogCategoryObjects,
} from './farmosUtil.utilities.js';

/**
 * Create a new activity log (`log--activity`) for a winter kill.
 *
 * @param {string} winterKillDate - The date of the winter kill.
 * @param {string} locationName - The name of the location where the winter kill occurred.
 * @param {Array<string>} bedNames - The names of the bed(s) where the winter kill occurred.
 * @param {Object} plantAsset - The plant asset created by the winter kill.
 *
 * @returns {Object} The new activity log.
 * @throws {Error} if unable to create the activity log.
 *
 * @category Winter Kill
 */
export async function createWinterKillActivityLog(
  winterKillDate,
  locationName,
  bedNames = [],
  plantAsset
) {
  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const logCategoriesArray = await getLogCategoryObjects([
    'termination',
    'seeding_cover_crop',
  ]);

  const cropIdToTermMap = await getCropIdToTermMap();
  const logName =
    dayjs(winterKillDate).format('YYYY-MM-DD') +
    '_wk_' +
    plantAsset.relationships.plant_type
      .map((crop) => cropIdToTermMap.get(crop.id).attributes.name)
      .join('_');

  const activityLogData = {
    type: 'log--activity',
    attributes: {
      name: logName,
      timestamp: dayjs(winterKillDate).format(),
      status: 'done',
      is_movement: true,
      purchase_date: dayjs(winterKillDate).format(),
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
    },
  };

  const farm = await getFarmOSInstance();
  const activityLog = farm.log.create(activityLogData);
  await farm.log.send(activityLog);

  return activityLog;
}

/**
 * Get the winter kill activity log with the specified id.
 *
 * @param {string} activityLogId the id of the activity log.
 * @returns {Object} the activity log with the specified id.
 * @throws {Error} if unable to get the activity log.
 *
 * @category Winter Kill
 */
export async function getWinterKillActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--activity', id: activityLogId },
  });
  return results.data[0];
}

/**
 * Delete the winter kill activity log with the specified id.
 *
 * @param {string} activityLogId the id of the activity log.
 * @returns {Object} the deleted activity log.
 * @throws {Error} if unable to delete the activity log.
 *
 * @category Winter Kill
 */
export async function deleteWinterKillActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('activity', activityLogId);
    return result;
  } catch (error) {
    console.error('deleteWinterKillActivityLog:');
    console.error(' Unable to delete activity log with id: ' + activityLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
