/*
 * Utility functions for getting and working with soil.
 */

import dayjs from 'dayjs';
import { getFarmOSInstance } from './farmosUtil.core.js';
import {
  getPlantingLocationObjects,
  getLogCategoryObjects,
  getQuantityObjects,
} from './farmosUtil.utilities.js';

/**
 * Create a new activity log (`log--activity`) for a soil disturbance.
 */
export async function createSoilDisturbanceActivityLog(
  disturbanceDate,
  locationName,
  bedNames = [],
  logCategories,
  plantAsset = null,
  quantities = [],
  equipment = [],
  comment = ''
) {
  // Helper functions from the utilities module.
  const locationArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const logCategoriesArray = await getLogCategoryObjects(logCategories);
  const quantitiesArray = getQuantityObjects(quantities);

  let equipmentArray = [];
  for (const equip of equipment) {
    equipmentArray.push({
      type: equip.type,
      id: equip.id,
    });
  }

  let assetName =
    dayjs(disturbanceDate).format('YYYY-MM-DD') + '_sd_' + locationName;

  const activityLogData = {
    type: 'log--activity',
    attributes: {
      name: assetName,
      timestamp: dayjs(disturbanceDate).format(),
      status: 'done',
      purchase_date: dayjs(disturbanceDate).format(),
      notes: { value: comment },
    },
    relationships: {
      location: locationArray,
      asset: Array.isArray(plantAsset)
        ? plantAsset.map((asset) => ({ type: 'asset--plant', id: asset.id }))
        : plantAsset
        ? [{ type: 'asset--plant', id: plantAsset.id }]
        : [],
      category: logCategoriesArray,
      quantity: quantitiesArray,
      equipment: equipmentArray,
    },
  };

  const farm = await getFarmOSInstance();
  const activityLog = farm.log.create(activityLogData);
  await farm.log.send(activityLog);

  return activityLog;
}

/**
 * Get the soil disturbance activity log with the specified id.
 */
export async function getSoilDisturbanceActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--activity', id: activityLogId },
  });
  return results.data[0];
}

/**
 * Delete the soil disturbance activity log with the specified id.
 */
export async function deleteSoilDisturbanceActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('activity', activityLogId);
    return result;
  } catch (error) {
    console.error('deleteSoilDisturbanceActivityLog:');
    console.error('  Unable to delete activity log with id: ' + activityLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
