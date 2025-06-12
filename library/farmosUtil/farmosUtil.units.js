/*
 * Utility functions for getting and working with units.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getUnits` function.
 * This is useful when an action may change the units that exist in the
 * system
 *
 * @category Units
 */
export function clearCachedUnits() {
  clearCachedValue('units');
}

/**
 * Get taxonomy term objects for all of the units.
 * These are the taxonomy terms of type `taxonomy_term--unit`.
 * The units will appear in alphabetical order.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedUnits`]{@link #module_farmosUtil.clearCachedUnits}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the units.
 * @returns {Array<Object>} an array of all of taxonomy terms representing units.
 *
 * @category Units
 */
export async function getUnits() {
  return fetchWithCaching('units', async () => {
    const farm = await getFarmOSInstance();

    const units = await farm.term.fetch({
      filter: {
        type: 'taxonomy_term--unit',
      },
      limit: Infinity,
    });

    if (units.rejected.length != 0) {
      throw new Error('Unable to fetch units.', units.rejected);
    }

    units.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return units.data;
  });
}

/**
 * Get a map from the name of a unit taxonomy term to the
 * farmOS unit term object.
 *
 * NOTE: This function makes a call to
 * [`getUnits`]{@link #module_farmosUtil.getUnits}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the units.
 * @returns {Map<String,Object>} a `Map` from the unit `name` to the `taxonomy_term--unit` object.
 *
 * @category Units
 */
export async function getUnitToTermMap() {
  const units = await getUnits();
  const map = new Map(units.map((unit) => [unit.attributes.name, unit]));
  return map;
}

/**
 * Get a map from the id of a unit taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: This function makes a call to
 * [`getUnits`]{@link #module_farmosUtil.getUnits}
 * and builds the `Map` using the returned `Array<Object>`
 *
 * @throws {Error} if unable to fetch the units.
 * @returns {Map<String,Object>} a `Map` from the unit `id` to the `taxonomy_term--unit` object.
 *
 * @category Units
 */
export async function getUnitIdToTermMap() {
  const units = await getUnits();
  const map = new Map(units.map((unit) => [unit.id, unit]));
  return map;
}
