/*
 * Utility functions for getting and working with soilDisturbanceTerminationLog.
 */

import dayjs from 'dayjs';
import { getFarmOSInstance } from './farmosUtil.core.js';
import { getBeds, getBedNameToAssetMap } from './farmosUtil.beds.js';
import { getCropIdToTermMap } from './farmosUtil.crops.js';
import { archivePlantAsset } from './farmosUtil.plant.js';
import {
  getPlantingLocationObjects,
  getLogCategoryObjects,
} from './farmosUtil.utilities.js';

/**
 * Creates an activity log (`log--activity`) for a soil disturbance termination event.
 */
export async function createSoilDisturbanceTerminationLog(
  terminationDate,
  locationName,
  bedNames = [],
  plantAsset
) {
  const farm = await getFarmOSInstance();
  const allBedsMap = await getBeds();
  const cropIdToTermMap = await getCropIdToTermMap();
  const bedNameToAssetMap = await getBedNameToAssetMap();
  const existingBeds = plantAsset.relationships.location.slice(1) || [];

  if (existingBeds.length == 0) {
    await archivePlantAsset(plantAsset.id, true);
    return;
  }

  let bedIdsToTerminate = [];
  if (bedNames.length > 0) {
    bedIdsToTerminate = bedNames
      .map((name) => {
        const bedAsset = bedNameToAssetMap.get(name);
        return bedAsset ? bedAsset.id : null;
      })
      .filter((id) => id);
  } else {
    bedIdsToTerminate = existingBeds.map((bed) => bed.id);
  }

  const bedsToKeep = existingBeds
    .filter((bed) => !bedIdsToTerminate.includes(bed.id))
    .map((bed) => {
      const foundBed = allBedsMap.find((allBed) => allBed.id === bed.id);
      return foundBed ? foundBed.attributes.name : null;
    })
    .filter((name) => name);

  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedsToKeep,
  ]);
  const logCategoriesArray = await getLogCategoryObjects(['termination']);

  const logName = `${dayjs(terminationDate).format(
    'YYYY-MM-DD'
  )}_sd_${plantAsset.relationships.plant_type
    .map((crop) => cropIdToTermMap.get(crop.id).attributes.name)
    .join('_')}`;

  let comment = 'Terminated plants in ';
  if (bedNames.length === 1) {
    comment += 'bed ' + bedNames[0] + '.';
  } else {
    comment += 'beds ' + bedNames.join(', ') + '.';
  }

  const terminationLogData = {
    type: 'log--activity',
    attributes: {
      name: logName,
      timestamp: dayjs(terminationDate).format(),
      status: 'done',
      is_movement: true,
      notes: { value: comment },
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
    },
  };

  const createdLog = await farm.log.send(farm.log.create(terminationLogData));

  if (bedsToKeep.length === 0) {
    await archivePlantAsset(plantAsset.id, true);
  }

  return createdLog;
}

/**
 * Get the soil disturbance termination activity log with the specified id.
 */
export async function getSoilDisturbanceTerminationLog(activityLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--activity', id: activityLogId },
  });
  return results.data[0];
}

/**
 * Delete the soil disturbance termination activity log with the specified id.
 */
export async function deleteSoilDisturbanceTerminationLog(activityLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('activity', activityLogId);
    return result;
  } catch (error) {
    console.error('deleteSoilDisturbanceTerminationLog:');
    console.error(' Unable to delete activity log with id: ' + activityLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
