/*
 * Utility functions for getting and working with harvests.
 */

import dayjs from 'dayjs';
import { getFarmOSInstance } from './farmosUtil.core.js';
import {
  getCropIdToTermMap,
  getCropNameToTermMap,
} from './farmosUtil.crops.js';
import {
  getPlantingLocationObjects,
  getLogCategoryObjects,
  getQuantityObjects,
} from './farmosUtil.utilities.js';

/**
 * Create a new harvest log (`log--harvest`) for a harvest.
 *
 * @param {string} harvestDate the date of the harvest.
 * @param {string} locationName the name of the location where the harvest occurred.
 * @param {Array<string>} bedNames the names of the bed(s) where the harvest occurred.
 * @param {Object} plantAsset the plant asset that was harvested.
 * @param {Array<Object>} [quantities] an array of quantity objects.
 * @returns {Object} the new harvest log.
 * @throws {Error} if unable to create the harvest log.
 *
 * @category Harvest
 */
export async function createHarvestLog(
  harvestDate,
  locationName,
  bedNames = [],
  plantAsset,
  quantities
) {
  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const logCategoriesArray = await getLogCategoryObjects(['harvest']);
  const quantitiesArray = getQuantityObjects(quantities);

  const cropIdToTermMap = await getCropIdToTermMap();
  const logName =
    dayjs(harvestDate).format('YYYY-MM-DD') +
    '_ha_' +
    plantAsset.relationships.plant_type
      .map((crop) => cropIdToTermMap.get(crop.id).attributes.name)
      .join('_');

  const harvestLogData = {
    type: 'log--harvest',
    attributes: {
      name: logName,
      timestamp: dayjs(harvestDate).format(),
      status: 'done',
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
      quantity: quantitiesArray,
    },
  };

  const farm = await getFarmOSInstance();
  const harvestLog = farm.log.create(harvestLogData);
  await farm.log.send(harvestLog);

  return harvestLog;
}

/**
 * Get the harvest log with the specified id.
 *
 * @param {string} harvestLogId the id of the harvest log.
 * @returns {Object} the harvest log with the specified id.
 * @throws {Error} if unable to get the harvest log.
 *
 * @category Harvest
 */
export async function getHarvestLog(harvestLogId) {
  const farm = await getFarmOSInstance();
  const results = await farm.log.fetch({
    filter: { type: 'log--harvest', id: harvestLogId },
  });
  return results.data[0];
}

/**
 * Delete the harvest log with the specified id.
 *
 * @param {string} harvestLogId the id of the harvest log.
 * @returns {Object} the response from the server.
 * @throws {Error} if unable to delete the harvest log.
 *
 * @category Harvest
 */
export async function deleteHarvestLog(harvestLogId) {
  const farm = await getFarmOSInstance();
  try {
    const result = await farm.log.delete('harvest', harvestLogId);
    return result;
  } catch (error) {
    console.error('deleteHarvestLog:');
    console.error('  Unable to delete harvest log with id: ' + harvestLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}

/**
 * Get the possible harvest units for a crop.
 *
 * The first element of the returned array is a reference to the crop's
 * default harvest unit (`fd2_harvest_unit`). Each subsequent element is a
 * reference to one of the crop's additional harvest units
 * (`fd2_unit_conversions`) and has its conversion factor in its
 * `meta.factor` property.
 *
 * Each element is a relationship object with the format:
 * ```Javascript
 * { type: 'taxonomy_term--unit',
 *   id: unit_id,
 *   meta: { factor: conversion_factor, ... }
 * }
 * ```
 * Use [`getUnitIdToTermMap`]{@link #module_farmosUtil.getUnitIdToTermMap}
 * to get the `taxonomy_term--unit` object for an element.
 *
 * @param {string} cropName the name of the crop.
 * @returns {Array<Object>} an array of references to the harvest units for the crop.
 * @throws {Error} if the crop name is invalid or unable to fetch the crops.
 *
 * @category Harvest
 */
export async function getHarvestUnits(cropName) {
  const cropNameToTermMap = await getCropNameToTermMap();
  const crop = cropNameToTermMap.get(cropName);

  if (!crop) {
    console.error('getHarvestUnits: Invalid crop name: ' + cropName);
    throw new Error('Invalid crop name: ' + cropName);
  }

  return [
    crop.relationships.fd2_harvest_unit,
    ...crop.relationships.fd2_unit_conversions,
  ];
}
