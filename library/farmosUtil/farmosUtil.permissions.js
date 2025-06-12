/*
 * Utility functions for getting and working with permissions.
 */

import {
  fetchWithCaching,
  clearCachedValue,
  getFarmOSInstance,
  inFarmOS,
} from './farmosUtil.core.js';

/**
 * Clear the cached results from prior calls to the `getPermissions` function.
 * This is useful when it is necessary to force the permissions to be refreshed.
 * (e.g. changing users during a test.)
 *
 * @category Permissions
 */
export function clearCachedPermissions() {
  clearCachedValue('permissions');
}

/**
 * Get the permissions for the currently logged in farmOS user.
 * The list of permissions can be seen by logging into farmOS and visiting:
 *  http://farmos/api/permissions
 *
 * If a permission needs to be checked that is not yet supported it can be added
 * to the `$perms` array in the `permissions` function in
 * `modules/farm_fd2/src/module/Controller/FD2_Controller.php` file.
 *
 * The list of possible permissions can be found by logging into farmOS as `admin`
 * and visiting: http://farmos/admin/people/permissions. Right click on a checkbox
 * associated with a permission and "inspect" the element. The name of the permission
 * (e.g. `create plant asset`) is given in the `name` attribute of the checkbox element.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedPermissions`]{@link #module_farmosUtil.clearCachedPermissions}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the permissions.
 * @returns {Object} an object with one property for each permission.
 * Each permission will have a `true` or `false` value.
 *
 * @category Permissions
 */
export async function getPermissions() {
  return fetchWithCaching('permissions', async () => {
    try {
      const farm = await getFarmOSInstance();
      let url = '';
      if (inFarmOS()) {
        const host = 'http://' + document.URL.split('/')[2];
        url = host + '/api/permissions';
      } else {
        url = 'http://farmos/api/permissions';
      }
      const resp = await farm.remote.request.get(url);
      return resp.data.permissions;
    } catch (err) {
      throw new Error('Unable to fetch permissions.', err);
    }
  });
}

/**
 * Check if the current user has a specific permission.
 *
 * The list of permissions can be seen by logging into farmOS and visiting:
 * http://farmos/api/permissions
 *
 * NOTE: This function makes a call to
 * [`getPermissions`]{@link #module_farmosUtil.getPermissions}
 * and uses the returned `Object` to check the permission.
 *
 * @param {String} permissionName the name of the permission to check.
 * @throws {Error} if unable to fetch the permissions.
 * @throws {Error} if the requested permission does not exist.
 * @return {boolean} true if the current user has the specified permission.
 *
 * @category Permissions
 */
export async function checkPermission(permissionName) {
  const permissions = await getPermissions();
  const perm = permissions[permissionName];
  if (perm === undefined) {
    /*
     * Throw an error here because the permission name is a string and
     * this will cause code to fail fast if the developer makes a typo
     * in the permission name, instead of returning false.
     */
    throw new Error(`Permission ${permissionName} does not exist.`);
  } else {
    return perm;
  }
}
