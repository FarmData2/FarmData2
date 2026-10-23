/*
 * Utility functions for getting and working with transplanting.
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
 * Create a new transplanting log (`log--transplanting`) for a transplanting.
 *
 * @param {string} transplantingDate - The date of the transplanting.
 * @param {string} locationName - The name of the location where the transplanting occurred.
 * @param {Array<string>} bedNames - The names of the bed(s) where the transplanting occurred.
 * @param {Object} plantAsset - The plant asset created by the transplanting.
 * @param {Array<Object>} [quantities] - An array of quantity objects.
 * @returns {Object} The new transplanting log.
 * @throws {Error} if unable to create the transplanting log.
 *
 * @category transplanting
 */
export async function createTransplantingLog(
  transplantingDate,
  locationName,
  bedNames = [],
  plantAsset,
  quantities
) {
  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const logCategoriesArray = await getLogCategoryObjects(['transplanting']);
  const quantitiesArray = getQuantityObjects(quantities);

  const cropIdToTermMap = await getCropIdToTermMap();
  const logName =
    dayjs(transplantingDate).format('YYYY-MM-DD') +
    '_xp_' +
    cropIdToTermMap.get(plantAsset.relationships.plant_type[0].id).attributes
      .name;

  const transplantingLogData = {
    type: 'log--transplanting',
    attributes: {
      name: logName,
      timestamp: dayjs(transplantingDate).format(),
      status: 'done',
      is_movement: true,
      purchase_date: dayjs(transplantingDate).format(),
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
      quantity: quantitiesArray,
    },
  };

  const farm = await getFarmOSInstance();
  const transplantingLog = farm.log.create(transplantingLogData);
  await farm.log.send(transplantingLog);

  return transplantingLog;
}

/**
 * Get the transplanting log with the specified id.
 *
 * @param {string} transplantingLogId the id of the transplanting log.
 * @returns {Object} the transplanting log with the specified id.
 * @throws {Error} if unable to get the transplanting log.
 *
 * @category transplanting
 */
export async function getTransplantingLog(transplantingLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--transplanting', id: transplantingLogId },
  });
  return results.data[0];
}

/**
 * Delete the transplanting log with the specified id.
 *
 * @param {string} transplantingLogId the id of the transplanting log.
 * @returns {Object} the deleted transplanting log.
 * @throws {Error} if unable to delete the transplanting log.
 *
 * @category transplanting
 */
export async function deleteTransplantingLog(transplantingLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('transplanting', transplantingLogId);
    return result;
  } catch (error) {
    console.error('deleteTransplantingLog:');
    console.error(
      '  Unable to delete transplanting log with id: ' + transplantingLogId
    );
    console.error(error.message);
    console.error(error);
    throw error;
  }
}