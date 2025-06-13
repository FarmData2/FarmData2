/*
 * Utility functions for getting and working with greenhouses.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getGreenhouses` function.
 * This is useful when an action may change the greenhouses that exist in the
 * system
 *
 * @category Greenhouses
 */
export function clearCachedGreenhouses() {
  clearCachedValue('greenhouses');
}

/**
 * Get the asset objects for all of the active structures that represent greenhouses.
 * These are the assets of type `asset--structure` that have `structure_type` of
 * `greenhouse`. The greenhouses will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedGreenhouses`]{@link #module_farmosUtil.clearCachedGreenhouses}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the greenhouses.
 * @returns {Array<Object>}an array of all of land assets representing greenhouses.
 *
 * @category Greenhouses
 */
export async function getGreenhouses() {
  return fetchWithCaching('greenhouses', async () => {
    const farm = await getFarmOSInstance();

    const greenhouses = await farm.asset.fetch({
      filter: {
        type: 'asset--structure',
        structure_type: 'greenhouse',
        status: 'active',
      },
      limit: Infinity,
    });

    if (greenhouses.rejected.length != 0) {
      throw new Error('Unable to fetch greenhouses.', greenhouses.rejected);
    }

    greenhouses.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return greenhouses.data;
  });
}

/**
 * Get a map from the name of a greenhouse asset to the
 * farmOS structure asset object.
 *
 * NOTE: This function makes a call to
 * [`getGreenhouses`]{@link #module_farmosUtil.getGreenhouses}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the greenhouses.
 * @returns {Map<String,Object>} a `Map` from the greenhouse `name` to the `asset--structure` object.
 *
 * @category Greenhouses
 */
export async function getGreenhouseNameToAssetMap() {
  const greenhouses = await getGreenhouses();
  const map = new Map(greenhouses.map((gh) => [gh.attributes.name, gh]));
  return map;
}

/**
 * Get a map from the id of a greenhouse asset to the
 * farmOS structure asset object.
 *
 * NOTE: This function makes a call to
 * [`getGreenhouses`]{@link #module_farmosUtil.getGreenhouses}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the greenhouses.
 * @returns {Map<String,Object>} a `Map` from the greenhouse `id` to the `asset--structure` object.
 *
 * @category Greenhouses
 */
export async function getGreenhouseIdToAssetMap() {
  const greenhouses = await getGreenhouses();
  const map = new Map(greenhouses.map((gh) => [gh.id, gh]));
  return map;
}
