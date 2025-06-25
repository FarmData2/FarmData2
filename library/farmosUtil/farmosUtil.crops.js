/*
 * Utility functions for getting and working with crops.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getCrops` function.
 * This is useful when an action may change the crops that exist in the
 * system
 *
 * @category Crops
 */
export function clearCachedCrops() {
  clearCachedValue('crops');
}

/**
 * Get taxonomy term objects for all of the crops.
 * These are the taxonomy terms of type `taxonomy_term--plant_type`.
 * The crops will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedCrops`]{@link #module_farmosUtil.clearCachedCrops}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the crops.
 * @returns {Array<Object>} an array of all of taxonomy terms representing crops.
 *
 * @category Crops
 */
export async function getCrops() {
  return fetchWithCaching('crops', async () => {
    const farm = await getFarmOSInstance();

    const crops = await farm.term.fetch({
      filter: {
        type: 'taxonomy_term--plant_type',
      },
      limit: Infinity,
    });

    if (crops.rejected.length != 0) {
      throw new Error('Unable to fetch crops.', crops.rejected);
    }

    crops.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return crops.data;
  });
}

/**
 * Get a map from the name of a crop taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: This function makes a call to
 * [`getCrops`]{@link #module_farmosUtil.getCrops}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the crops.
 * @returns {Map<String,Object>} a `Map` from the crop `name` to the `taxonomy_term--plant_type` object.
 *
 * @category Crops
 */
export async function getCropNameToTermMap() {
  const crops = await getCrops();
  const map = new Map(crops.map((cr) => [cr.attributes.name, cr]));
  return map;
}

/**
 * Get a map from the id of a crop taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: This function makes a call to
 * [`getCrops`]{@link #module_farmosUtil.getCrops}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the crops.
 * @returns {Map<String,Object>} a `Map` from the crop `id` to the `taxonomy_term--plant_type` object.
 *
 * @category Crops
 */
export async function getCropIdToTermMap() {
  const crops = await getCrops();
  const map = new Map(crops.map((cr) => [cr.id, cr]));
  return map;
}
