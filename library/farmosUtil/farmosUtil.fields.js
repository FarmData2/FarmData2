/*
 * Utility functions for getting and working with fields.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getFields` function.
 * This is useful when an action may change the fields that exist in the
 * system
 *
 * @category Fields
 */
export function clearCachedFields() {
  clearCachedValue('fields');
}

/**
 * Get the asset objects for all of the active locations that represent fields.
 * These are the assets of type `asset--land` that have `land_type` of `field`.
 * The fields will appear in alphabetical order by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedFields`]{@link #module_farmosUtil.clearCachedFields}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the fields.
 * @returns {Array<Object>} a array of all of land assets representing fields.
 *
 * @category Fields
 */
export async function getFields() {
  return fetchWithCaching('fields', async () => {
    const farm = await getFarmOSInstance();

    const fields = await farm.asset.fetch({
      filter: {
        type: 'asset--land',
        land_type: 'field',
        status: 'active',
      },
      limit: Infinity,
    });

    if (fields.rejected.length != 0) {
      throw new Error('Unable to fetch fields.', fields.rejected);
    }

    fields.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return fields.data;
  });
}

/**
 * Get a map from the name of a field land asset to the
 * farmOS land asset object.
 *
 * NOTE: This function makes a call to
 * [`getFields`]{@link #module_farmosUtil.getFields}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the fields.
 * @returns {Map<String,Object>} a `Map` from the field `name` to the `asset--land` object.
 *
 * @category Fields
 */
export async function getFieldNameToAssetMap() {
  const fields = await getFields();
  const map = new Map(fields.map((field) => [field.attributes.name, field]));
  return map;
}

/**
 * Get a map from the id of a field land asset to the
 * farmOS land asset object.
 *
 * NOTE: This function makes a call to
 * [`getFields`]{@link #module_farmosUtil.getFields}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the fields.
 * @returns {Map<String,Object>} a `Map` from the field `id` to the `asset--land` object.
 *
 * @category Fields
 */
export async function getFieldIdToAssetMap() {
  const fields = await getFields();
  const map = new Map(fields.map((field) => [field.id, field]));
  return map;
}
