/*
 * Utility functions for getting and working with traySizes.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getTraySizes` function.
 * This is useful when an action may change the tray sizes that exist in the
 * system
 *
 * @category TraySizes
 */
export function clearCachedTraySizes() {
  clearCachedValue('tray_sizes');
}

/**
 * Get taxonomy term objects for all of the tray sizes.
 * These are the taxonomy terms of type `taxonomy_term--tray_size`.
 * The tray sizes will appear in numerical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedTraySizes`]{@link #module_farmosUtil.clearCachedTraySizes}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the tray sizes.
 * @returns {Array<Object>} an array of all of taxonomy terms representing tray sizes.
 *
 * @category TraySizes
 */

export async function getTraySizes() {
  return fetchWithCaching('tray_sizes', async () => {
    const farm = await getFarmOSInstance();

    const traySizes = await farm.term.fetch({
      filter: {
        type: 'taxonomy_term--tray_size',
      },
      limit: Infinity,
    });

    if (traySizes.rejected.length != 0) {
      throw new Error('Unable to fetch tray sizes.', traySizes.rejected);
    }

    traySizes.data.sort((o1, o2) => {
      let size1 = parseFloat(o1.attributes.name);
      let size2 = parseFloat(o2.attributes.name);
      return size1 - size2;
    });

    return traySizes.data;
  });
}

/**
 * Get a map from the name of a tray size taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: This function makes a call to
 * [`getTraySizes`]{@link #module_farmosUtil.getTraySizes}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the tray sizes.
 * @returns {Map<String,Object>} a `Map` from the tray size `name` to the `taxonomy_term--tray-size` object.
 *
 * @category TraySizes
 */
export async function getTraySizeToTermMap() {
  const sizes = await getTraySizes();
  const map = new Map(sizes.map((sz) => [sz.attributes.name, sz]));
  return map;
}

/**
 * Get a map from the id of a tray size taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: This function makes a call to
 * [`getTraySizes`]{@link #module_farmosUtil.getTraySizes}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the tray sizes.
 * @returns {Map<String,Object>} a `Map` from the tray size `id` to the `taxonomy_term--tray_size` object.
 *
 * @category TraySizes
 */
export async function getTraySizeIdToTermMap() {
  const sizes = await getTraySizes();
  const map = new Map(sizes.map((sz) => [sz.id, sz]));
  return map;
}
