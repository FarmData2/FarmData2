/*
 * Utility functions for getting and working with logCategories.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getLogCategories` function.
 * This is useful when an action may change the log categories that exist in the
 * system
 *
 * @category LogCategories
 */
export function clearCachedLogCategories() {
  clearCachedValue('log_categories');
}

/**
 * Get taxonomy term objects for all of the log categories.
 * These are the taxonomy terms of type `taxonomy_term--log_category`.
 * The log categories will appear in alphabetical order.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedLogCategories`]{@link #module_farmosUtil.clearCachedLogCategories}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the log categories.
 * @returns {Array<Object>} an array of all of taxonomy terms representing log categories.
 *
 * @category LogCategories
 */
export async function getLogCategories() {
  return fetchWithCaching('log_categories', async () => {
    const farm = await getFarmOSInstance();

    const categories = await farm.term.fetch({
      filter: {
        type: 'taxonomy_term--log_category',
      },
      limit: Infinity,
    });

    if (categories.rejected.length != 0) {
      throw new Error('Unable to fetch log categories.', categories.rejected);
    }

    categories.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return categories.data;
  });
}

/**
 * Get a map from the name of a log category taxonomy term to the
 * farmOS unit term object.
 *
 * NOTE: This function makes a call to
 * [`getLogCategories`]{@link #module_farmosUtil.getLogCategories}
 * and builds the `Map` using the returned `Array<Object>`
 *
 * @throws {Error} if unable to fetch the log categories.
 * @returns {Map<String,Object>} a `Map` from the log category `name` to the `taxonomy_term--log_category` object.
 *
 * @category LogCategories
 */
export async function getLogCategoryToTermMap() {
  const categories = await getLogCategories();
  const map = new Map(
    categories.map((category) => [category.attributes.name, category])
  );
  return map;
}

/**
 * Get a map from the id of a log category taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: This function makes a call to
 * [`getLogCategories`]{@link #module_farmosUtil.getLogCategories}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the log categories.
 * @returns {Map<String,Object>} a `Map` from the log category `id` to the `taxonomy_term--log_category` object.
 *
 * @category LogCategories
 */
export async function getLogCategoryIdToTermMap() {
  const categories = await getLogCategories();
  const map = new Map(categories.map((category) => [category.id, category]));
  return map;
}
