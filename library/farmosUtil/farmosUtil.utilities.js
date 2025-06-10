/**
 * @module farmosUtil.utilities
 *
 * @description General utility functions for building farmOS relationship objects.
 */

import { getFieldNameToAssetMap } from './farmosUtil.fields.js';
import { getGreenhouseNameToAssetMap } from './farmosUtil.greenhouses.js';
import { getBedNameToAssetMap } from './farmosUtil.beds.js';
import { getLogCategoryToTermMap } from './farmosUtil.logCategories.js';

/**
 * Get an array of location objects for each of the locations specified.
 *
 * @param {Array<string>} locationNames an array of field, bed and/or greenhouse names.
 * @returns {Array<Object>} an array of location objects with the format:
 * ```Javascript
 * { type: asset_type,
 * id: asset_id
 * }
 * ```
 * @throws {Error} if unable to get the location id for one or more of the listed locations.
 * @category Utilities
 */
export async function getPlantingLocationObjects(locationNames) {
  let locationsArray = [];
  const fieldMap = await getFieldNameToAssetMap();
  for (const locationName of locationNames) {
    let location = fieldMap.get(locationName);
    if (location) {
      // location is a field.
      locationsArray.push({
        type: 'asset--land',
        id: location.id,
      });
    } else {
      const greenhouseMap = await getGreenhouseNameToAssetMap();
      location = greenhouseMap.get(locationName);
      if (location) {
        // location is a greenhouse.
        locationsArray.push({
          type: 'asset--structure',
          id: location.id,
        });
      } else {
        const bedMap = await getBedNameToAssetMap();
        location = bedMap.get(locationName);
        if (location) {
          // location is a bed.
          locationsArray.push({
            type: 'asset--land',
            id: location.id,
          });
        } else {
          console.error(
            'getPlantingLocationObjects: Invalid location name: ' + locationName
          );
          throw new Error('Invalid location name: ' + locationName);
        }
      }
    }
  }
  return locationsArray;
}

/**
 * Get an array of log category objects for each of the log categories specified.
 *
 * @param {Array<string>} logCategories an array of log category names.
 * @returns {Array<Object>} an array of log category objects with the format:
 * ```Javascript
 * { type: taxonomy_term--log_category,
 * id: log_category_id
 * }
 * ```
 * @Throws {Error} if unable to get the log category id for one or more of the listed categories.
 *
 * @category Utilities
 */
export async function getLogCategoryObjects(logCategories) {
  const categoryMap = await getLogCategoryToTermMap();
  let logCategoriesArray = [];

  for (const cat of logCategories) {
    logCategoriesArray.push({
      type: 'taxonomy_term--log_category',
      id: categoryMap.get(cat).id,
    });
  }

  return logCategoriesArray;
}

/**
 * Get an array of quantity objects for each of the quantities given.
 *
 * @param {Array<Object>} quantities an array of complete quantity objects.
 * @returns {Array<Object>} an array of simplified quantity objects with the format:
 * ```Javascript
 * { type: quantity_type,
 * id: quantity_id
 * }
 * ```
 *
 * @category Utilities
 */
export function getQuantityObjects(quantities) {
  const quantitiesArray = [];

  if (quantities) {
    for (const quant of quantities) {
      quantitiesArray.push({
        type: quant.type,
        id: quant.id,
      });
    }
  }

  return quantitiesArray;
}
