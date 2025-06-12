/*
 * Utility functions for getting and working with users.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getUsers` function.
 * This is useful when an action may change the users that exist in the
 * system.
 *
 * @category Users
 */
export function clearCachedUsers() {
  clearCachedValue('users');
}

/**
 * Get an array containing all of the active users from the farmOS host. The users
 * will appear in the array in order by the value of the `attributes.display_name`
 * property.
 *
 * NOTE: The `Anonymous` user does not appear in the returned array.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedUsers`]{@link #module_farmosUtil.clearCachedUsers}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the users.
 * @returns {Array<Object>} an array of farmOS `user--user` objects.
 *
 * @category Users
 */
export async function getUsers() {
  return fetchWithCaching('users', async () => {
    const farm = await getFarmOSInstance();

    const users = await farm.user.fetch({
      filter: {
        type: 'user--user',
        status: true,
      },
      limit: Infinity,
    });

    if (users.rejected.length != 0) {
      throw new Error('Unable to fetch users.', users.rejected);
    }

    users.data.sort((o1, o2) =>
      o1.attributes.display_name.localeCompare(o2.attributes.display_name)
    );

    return users.data;
  });
}

/**
 * Get a map from the user 'display_name` to the corresponding
 * farmOS user object.
 *
 * NOTE: This function make a call to
 * [`getUsers`]{@link #module_farmosUtil.getUsers}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the users.
 * @returns {Map<String,Object>}an `Map` from the user `display_name` to the `user--user` object.
 *
 * @category Users
 */
export async function getUsernameToUserMap() {
  const users = await getUsers();
  const map = new Map(
    users.map((user) => [user.attributes.display_name, user])
  );
  return map;
}

/**
 * Get a map from the user `id` to the farmOS user object.
 *
 * NOTE: This function make a call to
 * [`getUsers`]{@link #module_farmosUtil.getUsers}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the users.
 * @returns {Map<String,Object>} an `Map` from the user `id` to the `user--user` object.
 *
 * @category Users
 */
export async function getUserIdToUserMap() {
  const users = await getUsers();
  const map = new Map(users.map((user) => [user.id, user]));
  return map;
}
