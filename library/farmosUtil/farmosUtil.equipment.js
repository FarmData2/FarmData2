/*
 * Utility functions for getting and working with equipment.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getEquipment` function.
 * This is useful when an action may change the equipment that exist in the
 * system
 *
 * @category Equipment
 */
export function clearCachedEquipment() {
  clearCachedValue('equipment');
}

/**
 * Get asset objects for equipment.
 *
 * Equipment is represented by asset objects with the `type` of `asset--equipment`.
 *
 * Equipment assets are categorized by references to a parent equipment asset.
 * These categories include: `General`, `Seeding`, ... etc.
 * A full list of categories can be found by looking at
 * "Records" -> "Assets" -> "Equipment" in the farmOS interface.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedEquipment`]{@link #module_farmosUtil.clearCachedEquipment}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the equipment.
 * @returns {Array<Object>} an alphabetized array of all of the assets representing equipment.
 *
 * @category Equipment
 */
export async function getEquipment() {
  return fetchWithCaching('equipment', async () => {
    const farm = await getFarmOSInstance();

    const equipment = await farm.asset.fetch({
      filter: {
        type: 'asset--equipment',
      },
      limit: Infinity,
    });

    if (equipment.rejected.length != 0) {
      throw new Error('Unable to fetch equipment.', equipment.rejected);
    }

    equipment.data.sort((o1, o2) =>
      o1.attributes.name.localeCompare(o2.attributes.name)
    );

    return equipment.data;
  });
}

/**
 * Get a map from the name of an equipment asset to the
 * farmOS equipment asset object.
 *
 * NOTE: This function makes a call to
 * [`getEquipment`]{@link #module_farmosUtil.getEquipment}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @param {Array<String>} [categories] an array of equipment categories to include (e.g. `Seeding`, `General`).
 * If omitted, all of the equipment assets will be added to the map.
 * Note that the asset objects representing the equipment categories are never included in the map.
 * @throws {Error} if unable to fetch the equipment.
 * @returns {Map<String,Object>} a `Map` from the equipment asset `name` to the `equipment--asset` object.
 *
 * @category Equipment
 */
export async function getEquipmentNameToAssetMap(categories = []) {
  const equipment = await getEquipment();

  const parentIdToName = new Map(
    equipment.map((eq) => [eq.id, eq.attributes.name])
  );

  const categoryParentName = 'Category';

  function filter(filtered, eq) {
    const hasParent = eq.relationships.parent.length != 0;
    const parentName = hasParent
      ? parentIdToName.get(eq.relationships.parent[0].id)
      : null;

    if (
      eq.attributes.name !== categoryParentName &&
      parentName !== categoryParentName &&
      (categories.length === 0 ||
        (hasParent && categories.includes(parentName)))
    ) {
      filtered.set(eq.attributes.name, eq);
    }
    return filtered;
  }

  const map = equipment.reduce(filter, new Map());

  return map;
}

/**
* Get a map from the id of an equipment asset to the
* farmOS asset object.
*
* NOTE: This function makes a call to
* [`getEquipment`]{@link #module_farmosUtil.getEquipment}
* and builds the `Map` using the returned `Array<Object>`
*
* @param {Array<String>} [categories] an array of equipment categories to include (e.g. `Seeding`, `General`).
* If omitted, all of the equipment assets will be added to the map.
* Note that the asset objects representing the equipment categories are never included in the map.

* @throws {Error} if unable to fetch the units.
* @returns {Map<String,Object>} a `Map` from the equipment asset `id` to the `equipment-asset` object.
*
* @category Equipment
*/
export async function getEquipmentIdToAssetMap(categories = []) {
  const equipment = await getEquipment();

  const parentIdToName = new Map(
    equipment.map((eq) => [eq.id, eq.attributes.name])
  );

  const categoryParentName = 'Category';

  function filter(filtered, eq) {
    const hasParent = eq.relationships.parent.length != 0;
    const parentName = hasParent
      ? parentIdToName.get(eq.relationships.parent[0].id)
      : null;

    if (
      eq.attributes.name !== categoryParentName &&
      parentName !== categoryParentName &&
      (categories.length === 0 ||
        (hasParent && categories.includes(parentName)))
    ) {
      filtered.set(eq.id, eq);
    }
    return filtered;
  }

  const map = equipment.reduce(filter, new Map());

  return map;
}
