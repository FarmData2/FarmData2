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
 * Create a new activity log (`log--activity`) for a transplanting.
 */
export async function createTransplantingActivityLog(
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

  const activityLogData = {
    type: 'log--activity',
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
  const activityLog = farm.log.create(activityLogData);
  await farm.log.send(activityLog);

  return activityLog;
}

/**
 * Get the transplanting activity log with the specified id.
 */
export async function getTransplantingActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--activity', id: activityLogId },
  });
  return results.data[0];
}

/**
 * Delete the transplanting activity log with the specified id.
 */
export async function deleteTransplantingActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('activity', activityLogId);
    return result;
  } catch (error) {
    console.error('deleteTransplantingActivityLog:');
    console.error('  Unable to delete activity log with id: ' + activityLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
