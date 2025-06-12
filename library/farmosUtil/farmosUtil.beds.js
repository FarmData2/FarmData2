/*
 * Utility functions for getting and working with beds.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getBeds` function.
 * This is useful when an action may change the beds that exist in the
 * system
 *
 * @category Beds
 */
export function clearCachedBeds() {
  clearCachedValue('beds');
}

/**
 * Get the asset objects for all of the active places that represent beds.
 * These are the assets of type `asset--land` that have `land_type` of `bed`.
 * The fields and beds will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedBeds`]{@link #module_farmosUtil.clearCachedBeds}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the beds.
 * @returns {Array<Object>} a array of all of land assets representing beds.
 *
 * @category Beds
 */
export async function getBeds() {
  return fetchWithCaching('beds', async () => {
    const farm = await getFarmOSInstance();

    const beds = await farm.asset.fetch({
      filter: {
        type: 'asset--land',
        land_type: 'bed',
        status: 'active',
      },
      limit: Infinity,
    });

    if (beds.rejected.length != 0) {
      throw new Error('Unable to fetch beds.', beds.rejected);
    }

    beds.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return beds.data;
  });
}

/**
 * Get a map from the name of a bed land asset to the
 * farmOS land asset object.
 *
 * NOTE: This function makes a call to
 * [`getBeds`]{@link #module_farmosUtil.getBeds}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the beds.
 * @returns {Map<String,Object>} a `Map` from the bed `name` to the `asset--land` object.
 *
 * @category Beds
 */
export async function getBedNameToAssetMap() {
  const beds = await getBeds();
  const map = new Map(beds.map((bed) => [bed.attributes.name, bed]));
  return map;
}

/**
 * Get a map from the id of a bed land asset to the
 * farmOS land asset object.
 *
 * NOTE: This function makes a call to
 * [`getBeds`]{@link #module_farmosUtil.getBeds}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the beds.
 * @returns {Map<String,Object>} a `Map` from the bed `id` to the `asset--land` object.
 *
 * @category Beds
 */
export async function getBedIdToAssetMap() {
  const beds = await getBeds();
  const map = new Map(beds.map((bed) => [bed.id, bed]));
  return map;
}
