/**
 * @module farmosUtil
 *
 * @description Utility functions for working with a farmOS host.
 *
 * All of the functions in this module make use of global variables and
 * the `sessionStorage` object to cache the results of the API calls that
 * they use to get their data.
 *
 * For example, when `getCrops()` is called
 * it makes an API call to get all of the `taxonomy_term--plant_type` terms.
 * The result of that API call is cached both in a global variable and in the
 * `sessionStorage` object.  The next time `getCrops()` or any of the
 * functions that use it (e.g. `getCropIdToNameMap()`) are called, the cached
 * values are used rather than making another API call. If a program takes an
 * action that will make the cached API results stale (e.g. creating a new crop)
 * then it should call the appropriate `clearCached...()` function
 * (e.g. [`clearCachedCrops`]{@link #module_farmosUtil.clearCachedCrops})
 * function to cause the next call to `getCrops()` to make a new API call that
 * fetches the fresh data.
 *
 * The `npm run printlog` command can be used to print out information
 * about farmOS objects that are used by this library
 * (e.g. `user--user`, `taxonomy_term--plant_type`, etc.).
 * - Use `npm run printlog` to print out a list of all of the farmOS objects.
 * - Use `npm run printlog <type>` to print out the structure of the <type> object.
 *   - E.g. `npm run printlog log--seeding`
 *   - E.g. `npm run printlog taxonomy_term--plant_type`
 *   - etc...
 *
 * Many of the functions in this module use the
 * [`farmOS.js` library]{@link https://github.com/farmOS/farmOS.js}, thus
 * its documentation can be very helpful in working with the farmOS object
 * provided by this library.
 *
 * @example
 * // Import the farmosUtil module - need to adjust path!
 * import * as farmosUtil from '<path>/farmosUtil/farmosUtil.js';
 *
 * // Get a FarmOS object that provides access to all of the farmOS.js functionality.
 * const farm = await farmosUtil.getFarmOSInstance();
 *
 * // Get a map from a crop name to the farmOS term object for the crop.
 * const cropNameToTermMap = await farmosUtil.getCropNameToTermMap();
 *
 * // Translate a crop name to its farmOS id.
 * const cropId = cropNameToTermMap.get('ARUGULA').id;
 */

import farmOS from 'farmos';
import dayjs from 'dayjs';
import * as runExclusive from 'run-exclusive';

/*
 * This global object holds all of the values that are cached in the
 * session storage by this library.  These are object that require
 * communication with the farmOS server.  They are cached to prevent
 * the overhead of repeated API calls for the same information.
 *
 * Things cached in this global are cached in the sessionStorage
 * also.
 */
var fd2Cache = {
  /*
   * The global farm variable ensures
   * that we only create one instance of the `farmOS` object
   * per page reload.  This is done so that we avoid the cost of
   * fetching the schema every time a `farmOS` object is needed within
   * a page.
   */
  farm: null,

  users: null,
  fields: null,
  greenhouses: null,
  beds: null,
  crops: null,
  tray_sizes: null,
  units: null,
  log_categories: null,
  permissions: null,
  equipment: null,
};

/*
 * These two variables will be used throughout to access either the
 * browser's localStorage/sessionStorage or the simulated versions
 * provided by node-localstorage from Node programs that used this
 * library.
 */
var libLocalStorage = null;
var libSessionStorage = null;

/**
 * @private
 *
 * Check if this page from which this function is called is currently
 * running within farmOS or not.  If it is not then it can be assumed
 * that we are running within the development environment (e.g. from
 * Node or from the dev server).
 *
 * This is used by the `getFarmOSInstance` function so that it can determine
 * the type type of farmOS object that is needed at runtime. This enables
 * the same front end code to run in farmOS, in Node and in the dev server.
 *
 * @returns {boolean} true if the page is within farmOS, false if not.
 */
function inFarmOS() {
  try {
    const onLocalhost = document.URL.startsWith('http://localhost');
    const inFarmOS = !onLocalhost;
    return inFarmOS;
  } catch (e) {
    return false;
  }
}

/**
 * Clears the cached farm variable but not the values stored in
 * the session storage.
 *
 * The primary use case for this function is in testing.  For example,
 * it allow us to test that the  `farmOS` object is cached both in a
 * global variable and in the `sessionStorage`.  It could also be useful
 * to force a reload of the schema if that were ever necessary.
 *
 * @category farmOS
 */
export function clearFarmGlobal() {
  fd2Cache.farm = null;
}

/**
 * Clear the cached farmOS object, token and schema.
 * This is useful when a new farmOS object is needed from scratch.
 *
 * @category farmOS
 */
export function clearCachedFarm() {
  fd2Cache.farm = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('schema');
  }
  if (libLocalStorage) {
    libLocalStorage.removeItem('farmOStoken');
  }
}

/**
 * @private
 *
 * Get the global variable used to cache the farmOS object.
 * This is useful for testing to ensure that the global is set at appropriate times.
 */
export function getFarmGlobal() {
  return fd2Cache.farm;
}

/**
 * Create and return an instance of the `farmos.js` `farmOS` object that will be used
 * to interact with the farmOS host. There will only ever be one instance of the
 * `farmOS` object.
 *
 * If a `hostURL`, `client`, `user` and `pass` are provided then a new
 * `farmOS` object will be created.
 *
 * If no `hostURL`, `client`, `user` and `pass` are provided then:
 * - If there is an exiting farmOS object it will be returned.
 * - Otherwise a new default instance is created with:
 *   - `hostURL = 'https://farmos.org'`
 *   - `client = 'farm'`
 *   - `user = 'admin'`
 *   - `pass = 'admin'`
 *
 * Note: When running within a page served by farmOS (e.g. in an entry point in
 * one of the modules served from the "live" server) the farmOS object will
 * have the same permissions as the user that has logged into farmOS. To ensure
 * that this is the case, front end code (e.g. in an entry point, .vue file) should
 * never provide credentials to this method. It should always be called as
 * `getFarmOSInstance()`.
 *
 * Note: In test cases that will run outside of farmOS (component, unit, e2e tests on
 * the dev server) the test can call `getFarmOSInstance(...)` with the credentials
 * it wants.  Then when the front end code calls `getFarmOSInstance()` with no
 * parameters, it will get the farmOS instance with the desired credentials. E2e tests
 * that are running on the "live" server will have the same credentials as the
 * user that is logged in by the test.
 *
 * Note: All cached API response and permissions are cleared when a
 * new `farmOS` object is created.
 *
 * Note: If one of the `hostURL`, `client`, `user` and `pass` parameters
 * is provided then all of them must be provided. This ensures that the
 * created farmOS object (i.e. identical code) will work in the browser,
 * in Node and in tests running both in the dev server and the live server.
 *
 * @param {String} hostURL url of the farmOS instance to which to connect.
 * @param {String} client the farmOS api client to use.
 * @param {String} user the username of the farmOS user to use for authentication.
 * @param {String} pass the pass the farmOS password for the user.
 * @param {Object} ls details the the object provided for local/session storage when running in Node. Omit this parameter to use the browser's `localStorage` and `sessionStorage`.
 * @throws {Error} if unable to create the `farmOS` object.
 * @returns {Object} the connected and configured `farmos.js` `farmOS` object.
 *
 * @category farmOS
 *
 * @example
 * // Import the farmosUtil module - need to adjust path!
 * import * as farmosUtil from '<path>/farmosUtil/farmosUtil.js';
 *
 * // Get a FarmOS object that provides access to all of the farmOS.js functionality.
 * // In farmOS this object will have the same permissions as the logged in user.
 * // When running in node or the dev server, this object will have `admin` permissions.
 * const farm = await farmosUtil.getFarmOSInstance();
 *
 * // Get a FarmOS object that using a particular username and password.
 * // This version may only be used when running in node or on the dev server
 * // (i.e. in a cypress test). It should never appear in front end code
 * // (i.e. never in a `.vue` file).
 * const farm2 = await farmosUtil.getFarmOSInstance(`http://farmos.org`, `farm`, `guest`, `farmadata2`);
 */
export const getFarmOSInstance = runExclusive.build(
  async (
    hostURL = null,
    client = null,
    user = null,
    pass = null,
    ls = null
  ) => {
    /*
     * Note: runExclusive (https://www.npmjs.com/package/run-exclusive)
     * is used to prevent concurrent execution of this function.  This eliminates
     * a race condition that allows the construction of multiple farmOS
     * objects by different components in the same page.
     */

    /*
     * Handle local and session storage here so that the functions
     * in this library can be used in both Node and in the browser
     * (live and on dev server and with Cypress).
     */
    if (!libLocalStorage) {
      libLocalStorage = ls;
      libSessionStorage = ls;
      if (!ls) {
        libLocalStorage = localStorage;
        libSessionStorage = sessionStorage;
      }
    }

    /*
     * Structure the code this way as a defensive coding strategy to ensure
     * that code providing credentials cannot sneak into the front end code
     * that may run in the live farmOS server.
     */
    if (inFarmOS()) {
      // All calls that run in farmOS must call getFarmOSInstance without parameters.
      if (hostURL || client || user || pass) {
        throw new Error(
          'Front end code should never provide credentials to getFarmOSInstance.'
        );
      } else {
        return await getFarmOSInstanceForInFarmOS();
      }
    } else {
      // Here we are not running within farmOS...
      if (hostURL && client && user && pass) {
        /*
         * We have been called from a test that provides specific credentials.
         * So we will create a new farmOS object with those credentials.
         */
        clearCachedFarm();
        return await getFarmOSInstanceForNotInFarmOS(
          hostURL,
          client,
          user,
          pass
        );
      } else if (!hostURL && !client && !user && !pass) {
        /*
         * We have been called from the front end or
         * from a test that did not provide credentials.
         */
        return await getFarmOSInstanceForNotInFarmOS();
      } else {
        throw new Error(
          'Invalid arguments passed to getFarmOSInstance from outside farmOS.' +
            ' If one of hostURL, client, user, or pass is provided, all must be provided.'
        );
      }
    }
  }
);

/**
 * @private
 *
 * Create a farmOS instance that works when it is running in a page that
 * is served from farmOS.  This instance will have the same permissions as
 * the currently logged in user.  It will use a CSRF token for operations
 * that modify the database.
 */
async function getFarmOSInstanceForInFarmOS() {
  if (fd2Cache.farm) {
    return fd2Cache.farm;
  } else {
    /*
     * Get the CSRF token needed for requests that modify data
     * when we are running inside farmOS.
     */
    const response = await fetch('/session/token');
    const csrfToken = await response.text();

    // Similar to: https://gist.github.com/paul121/26bed0987b73c6886fa3a0743c0f47eb
    const config = {
      host: '',
      clientId: 'farm',
      auth: (request) => {
        request.interceptors.request.use((config) => {
          if (config.method === 'get') {
            /*
             * Don't add CSRF  header to GET requests as it can leak the token.
             * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
             */
            return {
              ...config,
              headers: {
                ...config.headers,
              },
            };
          } else {
            return {
              ...config,
              headers: {
                ...config.headers,
                'X-CSRF-TOKEN': csrfToken,
              },
            };
          }
        }, Promise.reject);
      },
    };
    const options = { remote: config };

    fd2Cache.farm = farmOS(options);
    await setFarmSchema(fd2Cache.farm);

    return fd2Cache.farm;
  }
}

/**
 * @private
 *
 * Create a farmOS instance that will work when used outside of farmOS.
 * Practically this includes when running in small utility script in Node
 * (e.g. printlog) or when running in the dev server, including for Cypress
 * tests.
 */
async function getFarmOSInstanceForNotInFarmOS(
  hostURL = null,
  client = null,
  user = null,
  pass = null
) {
  /*
   * In the unlikely event that we have a global farm object but the local
   * storage does not contain a token, clear the global farm object so that we
   * create a new farm object from scratch.
   */
  if (fd2Cache.farm && fd2Cache.farm.remote.getToken() === null) {
    clearFarmGlobal();
  }

  // Only create a new farm object if we don't already have one in global_farm.
  let newFarm = false;
  if (!fd2Cache.farm) {
    newFarm = true;

    /*
     * We don't yet have a farmOS instance, and no credentials were provided
     * so we will create a new farmOS instance using the default credentials
     * Note: We know we are running only in the dev environment here!
     */
    if (!hostURL && !client && !user && !pass) {
      hostURL = 'http://farmos';
      client = 'farm';
      user = 'admin';
      pass = 'admin';
    }

    const config = {
      host: hostURL,
      clientId: client,
      getToken: () => JSON.parse(libLocalStorage.getItem('farmOStoken')),
      setToken: (token) =>
        libLocalStorage.setItem('farmOStoken', JSON.stringify(token)),
    };
    const options = { remote: config };

    /*
     * Enable this to be used both in Node, where farmOS is
     * not recognized but farmOS.default is and in Cypress for
     * testing where farmOS is recognized, but farmOS.default
     * is not.
     */
    if (typeof farmOS != 'function') {
      fd2Cache.farm = farmOS.default(options);
    } else {
      fd2Cache.farm = farmOS(options);
    }
  }

  /*
   * If we don't have an authentication token cached in localStorage,
   * then authenticate with the farmOS host to get the token.  We may
   * be changing users as well so clear the permissions if they were
   * cached.
   */
  if (fd2Cache.farm.remote.getToken() === null) {
    clearCachedPermissions();
    await fd2Cache.farm.remote.authorize(user, pass);
  }

  // If we created a new farm object then we need to get the schema.
  if (newFarm) {
    await setFarmSchema(fd2Cache.farm);
  }

  return fd2Cache.farm;
}

/**
 * @private
 *
 * Get the farmOS schema from the session storage (if it exists there)
 * or from the farmOS host.  If we get it from the farmOS host then place
 * it in the session storage for next time.
 */
async function setFarmSchema(farm) {
  // Try the session storage first...
  let schema = JSON.parse(libSessionStorage.getItem('schema'));
  if (schema == null) {
    // Not in session storage, so fetch schema from the farmOS host.
    await farm.schema.fetch();
    schema = farm.schema.get();
    // Cache in the session storage for next time.
    libSessionStorage.setItem('schema', JSON.stringify(schema));
  } else {
    await farm.schema.set(schema);
  }
}

/**
 * Print out the JSON structure of the specified farmOS record type.
 * (e.g. asset--land, log--harvest, etc...  This is useful as a development
 * and debugging tool.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @param {string} recordType the type of farmOS record to display.
 *
 * @category Utilities
 */
export function printObject(farm, recordType) {
  const obj = farm.log.create({ type: recordType });
  console.dir(obj);
}

/**
 * @private
 *
 * Checks the cache (global variable fd2Cache and sessionStorage) for a value with the
 * given key.  If the value is found in either cache, it is returned.  Otherwise
 * the fetchFunction is called.  The value returned by the fetchFunction is then
 * cached in both the fd2Cache variable and the sessionStorage and is then returned.
 *
 * @param {String} key the key associated with the value being fetched.
 * @param {Function} fetchFunction a function that fetches the value from the
 * farmOS API if necessary.  This function should return the result of the
 * API call or throw an Error if the API call fails.  If the relevant information
 * from the API call is wrapped in the `data` array property then this function should
 * just return the `data` array and not the entire response object.
 * @throws {Error} propagates any error thrown by the `fetchFunction`.
 * @returns {*} an Array<Object> or an Object (depending upon what is being fetched)
 * containing the requested data.
 */
export async function fetchWithCaching(key, fetchFunction) {
  /*
   * If the value to be fetched exits in the global variable cache
   * return it from there.
   */
  if (fd2Cache[key]) {
    return fd2Cache[key];
  }

  /*
   * Note we don't necessarily need a farmOS object here but we need
   * to be sure one has been created before we use the libSessionStorage
   * so that we know it ha been initialized.
   */
  await getFarmOSInstance();

  /*
   * If the value to be fetch exists in the sessionStorage then
   * return it from there.
   */
  const fromSS = libSessionStorage.getItem(key);
  if (fromSS) {
    fd2Cache[key] = JSON.parse(fromSS);
    return fd2Cache[key];
  }

  /*
   * Value to be fetched is neither in a global nor in the session storage
   * so fetch it using the API.
   */
  const fromAPI = await fetchFunction();

  /*
   * Now cache the fetched value both in the session storage and in
   * the global variable.
   */
  libSessionStorage.setItem(key, JSON.stringify(fromAPI));
  fd2Cache[key] = fromAPI;

  return fd2Cache[key];
}

/**
 * @private
 *
 * Get the value associated with the key in the fd2Cache global
 * variable.
 *
 * @param {String} key the key for the desired value.
 * @returns the value associated with the key in fd2Cache.
 */
export function getFromGlobalVariableCache(key) {
  return fd2Cache[key];
}

/**
 * @private
 *
 * Clear the value in the fd2Cache global variable that is
 * associated with the key.
 *
 * @param {String} key the key for the value to be cleared.
 */
export function clearFromGlobalVariableCache(key) {
  fd2Cache[key] = null;
}

/**
 * @private
 *
 * Clear the value associated with the key from the fd2Cache global
 * variable and from the session storage.
 *
 * @param {String} key the key associated with the value to be cleared.
 */
export function clearCachedValue(key) {
  fd2Cache[key] = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem(key);
  }
}

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
 * Get an array containing all of the active users from the farmOS host.  The users
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
 * `greenhouse`.  The greenhouses will appear in alphabetical order
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
 *     http://farmos/api/permissions
 *
 * If a permission needs to be checked that is not yet supported it can be added
 * to the `$perms` array in the `permissions` function in
 * `modules/farm_fd2/src/module/Controller/FD2_Controller.php` file.
 *
 * The list of possible permissions can be found by logging into farmOS as `admin`
 * and visiting: http://farmos/admin/people/permissions. Right click on a checkbox
 * associated with a permission and "inspect" the element.  The name of the permission
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
      const resp = await farm.remote.request.get(
        'http://farmos/api/permissions'
      );
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
 *   http://farmos/api/permissions
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

  function filter(filtered, eq) {
    if (
      // If the equipment has a parent
      // and either the categories list is empty or
      // the category name of the parent is in the list of categories
      eq.relationships.parent.length != 0 &&
      (categories.length == 0 ||
        categories.includes(parentIdToName.get(eq.relationships.parent[0].id)))
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

  function filter(filtered, eq) {
    if (
      // If the equipment has a parent
      // and either the categories list is empty or
      // the category name of the parent is in the list of categories
      eq.relationships.parent.length != 0 &&
      (categories.length == 0 ||
        categories.includes(parentIdToName.get(eq.relationships.parent[0].id)))
    ) {
      filtered.set(eq.id, eq);
    }
    return filtered;
  }

  const map = equipment.reduce(filter, new Map());

  return map;
}

/**
 * Execute a series of log, asset, or quantity creation operations as a transaction.
 * If one of the operations fails, then an attempt will be made to undo all of the completed operations.
 *
 * @param {Array<Object>} operations the operations to execute as a transaction.
 * Each operation must have the following structure:
 *
 * ```
 * {
 *   name: string,
 *   do: (Object) => async function performs an action and returns a result (e.g. creates a log, asset or quantity.)  The argument has the same format as the return value. It contains the result of all prior operations, allowing them to be used by future operations.
 *   undo: (Object) => async function that undoes the action performed by `do` (e.g. deletes a log, asset or quantity).  The argument has the same format as the return value and contains the result of all successfully completed operations.
 * }
 * ```
 *
 * @return {Object} an object with an attribute for each operation.
 * The attribute name is the operation name and its value is the result of the operation (i.e. the value returned from the `do` function).
 *
 * @throws {Error} if unable to execute the `do` function one of the operations or if unable to execute the `undo` of all operations in the transaction.
 * The `cause` of the error will include a `results` attribute with the same format as the returned object.
 * If an operation was completed and has been undone the attribute for that operation will have the value `undone`.
 * If an operation was completed but has not been undone the attribute for that operation will be the result of the operation.
 * If an operation was attempted but failed (and thus was not undone) the attribute for that operation will be `null`.
 * If an operation was never attempted (and thus also not undone) the attribute for that operation will be `undefined`.
 *
 * @category Utilities
 */
export async function runTransaction(operations) {
  const done = {};
  const undo = [];

  try {
    for (const operation of operations) {
      done[operation.name] = null;
      const result = await operation.do(done);
      done[operation.name] = result;
      undo.push(operation);
    }
  } catch (error) {
    console.error('runTransaction: Error running transaction.');
    console.error('  Attempting to undo completed operations.');
    for (const operation of undo.reverse()) {
      try {
        await operation.undo(done);
        done[operation.name] = 'undone';
        console.error('    ' + operation.name + ' undone.');
      } catch (error) {
        console.error('    failed to undo ' + operation.name);

        if (
          done[operation.name].id &&
          done[operation.name].attributes &&
          done[operation.name].attributes.name
        ) {
          console.error('      uuid: ' + done[operation.name].id);
          console.error('      name: ' + done[operation.name].attributes.name);
        }
      }
    }
    console.error('  Done.');

    const errorObj = new Error('Error running transaction.');
    errorObj.cause = error;
    errorObj.results = done;

    throw errorObj;
  }

  return done;
}

/**
 * Create a plant asset (i.e. an asset of type `asset--plant`).
 *
 * @param {string} date the date on which the plant asset was created.
 * @param {string} cropName the name of the crop to associate with the plant asset.
 * @param {string} [comment = ""] a comment the comment to associate with this plant asset.
 * @param {Array<Object>} [parents = []] an array of `asset--plant` objects to associate as parents of the new plant asset.
 * @return {Object} the new plant asset.
 * @throws {Error} if unable to create the plant asset.
 *
 * @category Plant
 */
export async function createPlantAsset(
  date,
  cropName,
  comment = '',
  parents = []
) {
  const farm = await getFarmOSInstance();
  const cropMap = await getCropNameToTermMap();

  const parentArray = [];
  for (const parent of parents) {
    parentArray.push({ type: 'asset--plant', id: parent.id });
  }

  const assetName = date + '_' + cropName;

  // create an asset--plant
  const plantAsset = farm.asset.create({
    type: 'asset--plant',
    attributes: {
      name: assetName,
      status: 'active',
      notes: { value: comment },
    },
    relationships: {
      plant_type: [
        {
          type: 'taxonomy_term--plant_type',
          id: cropMap.get(cropName).id,
        },
      ],
      parent: parentArray,
    },
  });

  await farm.asset.send(plantAsset);

  return plantAsset;
}

/**
 * Get the plant asset with the specified id.
 *
 * @param {string} plantAssetId the id of the plant asset.
 * @return {Object} the plant asset with the specified id.
 * @throws {Error} if unable to fetch the plant asset.
 *
 * @category Plant
 */
export async function getPlantAsset(plantAssetId) {
  const farm = await getFarmOSInstance();

  const results = await farm.asset.fetch({
    filter: { type: 'asset--plant', id: plantAssetId },
  });

  return results.data[0]; // only one asset with the plantAssetId.
}

/**
 * Delete the plant asset with the specified id.
 *
 * @param {string} plantAssetId the id of the plant asset.
 * @returns {Object} the response from the server.
 * @throws {Error} if unable to delete the plant asset.
 *
 * @category Plant
 */
export async function deletePlantAsset(plantAssetId) {
  const farm = await getFarmOSInstance();

  try {
    const result = await farm.asset.delete('plant', plantAssetId);
    return result;
  } catch (error) {
    console.error('deletePlantAsset:');
    console.error('  Unable to delete plant asset with id: ' + plantAssetId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}

/**
 * Archive or unarchive the plant asset with the specified id.
 *
 * @param {string} plantAssetId the id of the plant asset.
 * @param {boolean} archived `true` to archive or unarchive the plant asset, or `false` to unarchive it.
 */
export async function archivePlantAsset(plantAssetId, archived) {
  const farm = await getFarmOSInstance();

  const plantAsset = await getPlantAsset(plantAssetId);
  if (archived) {
    plantAsset.attributes.status = 'archived';
  } else {
    plantAsset.attributes.status = 'active';
  }

  return await farm.asset.send(plantAsset);
}

/**
 * Create a standard quantity (i.e. a quantity of type `quantity--standard`).
 *
 * @param {string} measure the measure type of the quantity (e.g. 'count', 'weight', 'volume')
 * @param {number} value the value of the quantity
 * @param {string} label a label for the quantity
 * @param {string} units the unit of the quantity
 * @param {Object} [inventoryAsset=null] the asset for which this quantity should adjust the inventory.
 * @param {string} [inventoryAdjustment=null] the type of inventory adjustment to make (e.g. `increment`, `decrement`)
 * @returns {Object} the new quantity object.
 * @throws {Error} if unable to create the quantity.
 *
 * @category Quantity
 */
export async function createStandardQuantity(
  measure,
  value,
  label,
  units,
  inventoryAsset = null,
  inventoryAdjustment = null
) {
  const farm = await getFarmOSInstance();
  const unitMap = await getUnitToTermMap();

  // create the necessary quantities
  const traysQuantity = farm.quantity.create({
    type: 'quantity--standard',
    attributes: {
      measure: measure,
      value: {
        decimal: value,
      },
      label: label,
      inventory_adjustment: inventoryAdjustment,
    },
    relationships: {
      units: {
        type: 'taxonomy_term--unit',
        id: unitMap.get(units).id,
      },
      inventory_asset: inventoryAsset
        ? {
            type: inventoryAsset.type,
            id: inventoryAsset.id,
          }
        : null,
    },
  });

  await farm.quantity.send(traysQuantity);

  return traysQuantity;
}

/**
 * Get the standard quantity with the specified id.
 *
 * @param {string} quantityId the id of the standard quantity.
 * @return {Object} the standard quantity with the specified id.
 * @throws {Error} if unable to fetch the standard quantity.
 *
 * @category Quantity
 */
export async function getStandardQuantity(quantityId) {
  const farm = await getFarmOSInstance();

  const results = await farm.quantity.fetch({
    filter: { type: 'quantity--standard', id: quantityId },
  });

  return results.data[0];
}

/**
 * Delete the standard quantity with the specified id.
 *
 * @param {string} quantityId the id of the standard quantity.
 * @returns {Object} the response from the server.
 * @throws {Error} if unable to delete the standard quantity.
 *
 * @category Quantity
 */
export async function deleteStandardQuantity(quantityId) {
  const farm = await getFarmOSInstance();

  try {
    const result = await farm.quantity.delete('standard', quantityId);
    return result;
  } catch (error) {
    console.error('deleteStandardQuantity:');
    console.error(
      '  Unable to delete standard quantity with id: ' + quantityId
    );
    console.error(error.message);
    console.error(error);
    throw error;
  }
}

/**
 * Get an array of location objects for each of the locations specified.
 *
 * @param {Array<string>} locationNames an array of field, bed and/or greenhouse names.
 * @returns {Array<Object>} an array of location objects with the format:
 * ```Javascript
 * { type: asset_type,
 *   id: asset_id
 * }
 * ```
 * @throws {Error} if unable to get the location id for one or more of the listed locations.
 * @category Utilities
 */
export async function getPlantingLocationObjects(locationNames) {
  let locationsArray = [];
  const fieldMap = await getFieldNameToAssetMap();
  for (const locationName of locationNames) {
    let location = fieldMap.get(locationName);
    if (location) {
      // location is a field.
      locationsArray.push({
        type: 'asset--land',
        id: location.id,
      });
    } else {
      const greenhouseMap = await getGreenhouseNameToAssetMap();
      location = greenhouseMap.get(locationName);
      if (location) {
        // location is a greenhouse.
        locationsArray.push({
          type: 'asset--structure',
          id: location.id,
        });
      } else {
        const bedMap = await getBedNameToAssetMap();
        location = bedMap.get(locationName);
        if (location) {
          // location is a bed.
          locationsArray.push({
            type: 'asset--land',
            id: location.id,
          });
        } else {
          console.error(
            'getPlantingLocationObjects: Invalid location name: ' + locationName
          );
          throw new Error('Invalid location name: ' + locationName);
        }
      }
    }
  }
  return locationsArray;
}

/**
 * Get an array of log category objects for each of the log categories specified.
 *
 * @param {Array<string>} logCategories an array of log category names.
 * @returns {Array<Object>} an array of log category objects with the format:
 * ```Javascript
 * { type: taxonomy_term--log_category,
 *   id: log_category_id
 * }
 * ```
 * @Throws {Error} if unable to get the log category id for one or more of the listed categories.
 *
 * @category Utilities
 */
export async function getLogCategoryObjects(logCategories) {
  const categoryMap = await getLogCategoryToTermMap();
  let logCategoriesArray = [];

  for (const cat of logCategories) {
    logCategoriesArray.push({
      type: 'taxonomy_term--log_category',
      id: categoryMap.get(cat).id,
    });
  }

  return logCategoriesArray;
}

/**
 * Get an array of quantity objects for each of the quantities given.
 *
 * @param {Array<Object>} quantities an array of complete quantity objects.
 * @returns {Array<Object>} an array of simplified quantity objects with the format:
 * ```Javascript
 * { type: quantity_type,
 *   id: quantity_id
 * }
 * ```
 *
 * @category Utilities
 */
export function getQuantityObjects(quantities) {
  const quantitiesArray = [];

  if (quantities) {
    for (const quant of quantities) {
      quantitiesArray.push({
        type: quant.type,
        id: quant.id,
      });
    }
  }

  return quantitiesArray;
}

/**
 * Create a new seeding log.
 *
 * @param {string} seedingDate the date of the seeding
 * @param {string} locationName the name of the location where the seeding occurred.
 * This must be the name of a field or greenhouse.
 * @param {Array<string>} bedNames the names of the bed(s) where the seeding occurred.
 * Can be empty if location does not contain beds or no beds were selected.
 * @param {Array<string>} logCategories the log categories associated with this log.
 * Must include `seeding` and one of `seeding_tray` or `seeding_direct` or `seeding_cover_crop`.
 * @param {Object} plantAsset the plant asset created by the seeding.
 * @param {Array<Object>} [quantities] an array of quantity objects
 * (e.g. `quantity--standard`) associated with the seeding.
 * @returns {Object} the new seeding log.
 * @throws {Error} if unable to create the seeding log.
 *
 * @category Seeding
 */
export async function createSeedingLog(
  seedingDate,
  locationName,
  bedNames,
  logCategories,
  plantAsset,
  quantities
) {
  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const quantitiesArray = getQuantityObjects(quantities);
  const logCategoriesArray = await getLogCategoryObjects(logCategories);

  // Generate log name based on conventions in docs/DataModel.md.
  const cropIdToNameMap = await getCropIdToTermMap();
  let logName = dayjs(seedingDate).format('YYYY-MM-DD');
  if (logCategories.includes('seeding_tray')) {
    logName += '_ts_';
  } else if (logCategories.includes('seeding_direct')) {
    logName += '_ds_';
  } else if (logCategories.includes('seeding_cover_crop')) {
    logName += '_cs_';
  }
  logName += cropIdToNameMap.get(plantAsset.relationships.plant_type[0].id)
    .attributes.name;

  const seedingLogData = {
    type: 'log--seeding',
    attributes: {
      name: logName,
      timestamp: dayjs(seedingDate).format(),
      status: 'done',
      is_movement: true,
      purchase_date: dayjs(seedingDate).format(),
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
      quantity: quantitiesArray,
    },
  };

  const farm = await getFarmOSInstance();
  const seedingLog = farm.log.create(seedingLogData);
  await farm.log.send(seedingLog);

  return seedingLog;
}

/**
 * Get the seeding log with the specified id.
 *
 * @param {string} seedingLogId the id of the seeding log.
 * @return {Object} the seeding log with the specified id.
 * @throws {Error} if unable to fetch the seeding log.
 *
 * @category Seeding
 */
export async function getSeedingLog(seedingLogId) {
  const farm = await getFarmOSInstance();

  const results = await farm.log.fetch({
    filter: { type: 'log--seeding', id: seedingLogId },
  });

  return results.data[0];
}

/**
 * Delete the seeding log with the specified id.
 *
 * @param {string} seedingLogId the id of the seeding log.
 * @returns {Object} the response from the server.
 * @throws {Error} if unable to delete the seeding log.
 *
 * @category Seeding
 */
export async function deleteSeedingLog(seedingLogId) {
  const farm = await getFarmOSInstance();

  try {
    const result = await farm.log.delete('seeding', seedingLogId);
    return result;
  } catch (error) {
    console.error('deleteSeedingLog:');
    console.error('  Unable to delete seeding log with id: ' + seedingLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}

/**
 * Create a new activity log (`log--activity`) for a soil disturbance.
 *
 * @param {string} disturbanceDate the date the disturbance took place.
 * @param {string} locationName the location where the disturbance took place.
 * This must be the name of a field or greenhouse.
 * @param {Array<string>} bedNames the names of the bed(s) where the disturbance occurred.
 * Can be empty if location does not contain beds or no beds were selected.
 * @param {Array<string>} logCategories the log categories associated with this log.
 * Must include `tillage`.
 * @param {Object} [plantAsset=null] the plant asset (i.e. `asset--plant`) affected by the disturbance.
 * @param {Array<Object>} [quantities=[]] an array of quantity (e.g. `quantity--standard`) objects associated with the disturbance.
 * @param {Array<Object>} [equipment=[]] an array of equipment asset objects (i.e. `asset--equipment`) that were used to disturb the soil.
 * @returns {Object} the new activity log.
 * @throws {Error} if unable to create the activity log.
 *
 * @category Soil
 */
export async function createSoilDisturbanceActivityLog(
  disturbanceDate,
  locationName,
  bedNames = [],
  logCategories,
  plantAsset = null,
  quantities = [],
  equipment = []
) {
  const locationArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const quantitiesArray = await getQuantityObjects(quantities);
  const logCategoriesArray = await getLogCategoryObjects(logCategories);

  let equipmentArray = [];
  for (const equip of equipment) {
    equipmentArray.push({
      type: equip.type,
      id: equip.id,
    });
  }

  let assetName =
    dayjs(disturbanceDate).format('YYYY-MM-DD') + '_sd_' + locationName;

  const activityLogData = {
    type: 'log--activity',
    attributes: {
      name: assetName,
      timestamp: dayjs(disturbanceDate).format(),
      status: 'done',
      purchase_date: dayjs(disturbanceDate).format(),
    },
    relationships: {
      location: locationArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
      quantity: quantitiesArray,
      equipment: equipmentArray,
    },
  };

  const farm = await getFarmOSInstance();
  const activityLog = farm.log.create(activityLogData);
  await farm.log.send(activityLog);

  return activityLog;
}

/**
 * Get the soil disturbance activity log with the specified id.
 *
 * @param {string} activityLogId the id of the soil disturbance activity log to get.
 * @returns the soil disturbance activity log with the specified id.
 *
 * @category Soil
 */
export async function getSoilDisturbanceActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();

  const results = await farm.log.fetch({
    filter: { type: 'log--activity', id: activityLogId },
  });

  return results.data[0];
}

/**
 * Delete the soil disturbance activity log with the specified id.
 *
 * @param {string} activityLogId the id of the soil disturbance activity log.
 * @returns {Object} the response from the server.
 * @throws {Error} if unable to delete the soil disturbance activity log.
 *
 * @category Soil
 */
export async function deleteSoilDisturbanceActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();

  try {
    const result = await farm.log.delete('activity', activityLogId);
    return result;
  } catch (error) {
    console.error('deleteSoilDisturbanceActivityLog:');
    console.error('  Unable to delete activity log with id: ' + activityLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}

/**
 * Extract the value for a UNIT from a quantity string given by the farmOS API.
 *
 * These strings come in several formats:
 * - `"25 TRAYS (Count)"`
 * - `"2 TRAYS (Count), 102.5 FEET (Length/depth)"`
 * - `"Trays ( Count ) 3 TRAYS (Increment 2019-02-19_ts_LETTUCE-ICEBERG inventory), Tray Size ( Ratio ) 72 CELLS/TRAY, Seeds ( Count ) 216 SEEDS"`
 *
 * This function assumes that:
 * - there will be only one inventory value per `UNIT`.  Note that farmOS allows one inventory value per (unit, label) pair but this function currently does not support that usage.
 * - the `UNIT` (e.g. `TRAYS`) will be preceded by a space, which is preceded by the desired value.
 *
 * @param {string} quantityString the quantity string from which to extract the value.
 * @param {string} unitName the name of the unit for which to extract the value.
 *
 * @returns {number} the value for the specified unit or `null` if no value is found for the unit.
 *
 * @category Utilities
 */
export function extractQuantity(quantityString, unitName) {
  const unitSplit = quantityString.split(unitName);

  if (unitSplit.length > 1) {
    const spaceSplit = unitSplit[0].split(' ');
    const valueStr = spaceSplit[spaceSplit.length - 2];
    return Number(valueStr);
  } else {
    return null;
  }
}

/**
 * Get an inventory value from an asset.
 *
 * @param {Object} asset the asset to search.
 * @param {string} measure the measure of the inventory value.
 * @param {string} units the units of the inventory value.
 * @return the inventory value or `null` if not found.
 *
 * @category Utilities
 */
export function getAssetInventory(asset, measure, units) {
  for (const inventory of asset.attributes.inventory) {
    if (inventory.measure === measure && inventory.units === units) {
      return inventory.value;
    }
  }
  return null;
}

/**
 * Get information about all of the seedlings that are candidates for transplanting.
 * These seedlings are plant assets that were tray seeded and have a positive inventory of trays.
 *
 * This function returns an array of objects with the following content:
 * ```json
 * {
 *    log_id: <id of seeding log created by the seeding>,
 *    log_uuid: <uuid of seeding log created by the seeding>,
 *    asset_id: <id of plant asset created by the seeding>,
 *    asset_uuid: <uuid of plant asset created by the seeding>,
 *    date: <date of tray seeding>,
 *    user: <name of user that entered the seeding>,
 *    crop: <name of crop that was seeded>,
 *    trays_location: <name of location where trays are>,
 *    asset_locations: <names of locations where crop has been transplanted thus far>,
 *    total_trays: <total number of trays seeded>
 *    available_trays: <number of trays available for transplanting>
 *    tray_size: <size of trays that were seeded>,
 *    seeds_per_cell: <number of seeds in each tray cell>,
 *    total_seeds: <total number of seeds used>
 *    notes: <notes attached to the seeding log and the plant asset>
 * }
 * ```
 *
 * @param {string} cropName optional crop name to filter seedlings by. If omitted seedlings of all crops will be returned.
 * @returns {Array<Object>} the list of seedlings.
 * @throws {Error} if unable to fetch seedlings.
 *
 * @category Transplanting
 */
export async function getSeedlings(cropName = null) {
  const farm = await getFarmOSInstance();
  try {
    let url = '/api/fd2_seedlings';
    if (cropName) {
      url = url + '?crop=' + cropName;
    }

    const raw = await farm.remote.request(url);
    let result = [];

    for (const seedling of raw.data) {
      const available_trays = extractQuantity(seedling.inventory, 'TRAYS');

      if (available_trays > 0) {
        const total_trays = extractQuantity(seedling.quantities, 'TRAYS');
        const tray_size = extractQuantity(seedling.quantities, 'CELLS/TRAY');
        const total_seeds = extractQuantity(seedling.quantities, 'SEEDS');
        const seeds_per_cell = total_seeds / (tray_size * total_trays);
        const notes = (seedling.log_notes + ' ' + seedling.asset_notes).trim();

        result.push({
          log_id: seedling.log_id,
          log_uuid: seedling.log_uuid,
          asset_id: seedling.asset_id,
          asset_uuid: seedling.asset_uuid,
          date: seedling.date,
          user: seedling.user,
          crop: seedling.crop,
          trays_location: seedling.trays_location,
          asset_locations: seedling.asset_locations,
          total_trays: total_trays,
          available_trays: available_trays,
          tray_size: tray_size,
          seeds_per_cell: seeds_per_cell,
          total_seeds: total_seeds,
          notes: notes,
        });
      }
    }

    return result;
  } catch (error) {
    console.error('getSeedlings:');
    console.error('  Unable to GET seedlings information.');
    console.error(error.message);
    console.error(error);
    throw new Error('Unable to fetch seedlings.', error);
  }
}

/**
 * Gets a list of the crop names of all crops that are eligible for
 * transplanting.  These are the names of all crops associated with
 * plant assets that were tray seeded and have a positive inventory of
 * trays.
 *
 * @return {Array<string>} the list of crop names.
 * @throws {Error} if unable to fetch the crop names.
 *
 * @category Transplanting
 */
export async function getTraySeededCropNames() {
  const farm = await getFarmOSInstance();
  try {
    let url = '/api/fd2_seedlings_crop_names';
    const raw = await farm.remote.request(url);

    const cropMap = new Map();
    for (const seeding of raw.data) {
      const trays = extractQuantity(seeding.inventory, 'TRAYS');
      if (cropMap.get(seeding.crop) == null) {
        cropMap.set(seeding.crop, trays);
      } else {
        cropMap.set(seeding.crop, cropMap.get(seeding.crop) + trays);
      }
    }

    const cropsWithTrays = Array.from(cropMap.keys()).filter(
      (cropName) => cropMap.get(cropName) > 0
    );

    return cropsWithTrays;
  } catch (error) {
    console.error('getTraySeededCropNames:');
    console.error('  Unable to GET tray seeded crop names.');
    console.error(error.message);
    console.error(error);
    throw new Error('Unable to fetch tray seeded crop names.', error);
  }
}

/**
 * Create a new activity log (`log--activity`) for a transplanting.
 *
 * @param {string} transplantingDate the date the transplanting took place.
 * @param {string} locationName the location to which the trays were transplanted.
 * This must be the name of a field or greenhouse with beds.
 * @param {Array<string>} bedNames the names of the bed(s) to which the plant was transplanted.
 * Can be empty if location does not contain beds or no beds were selected.
 * @param {Object} plantAsset the plant asset representing the transplanted trays.
 * @param {Array<Object>} [quantities] an array of quantity (e.g. `quantity--standard`) objects associated with the transplanting.
 * @returns {Object} the new activity log.
 *
 * @category Transplanting
 */
export async function createTransplantingActivityLog(
  transplantingDate,
  locationName,
  bedNames = [],
  plantAsset,
  quantities
) {
  const locationsArray = await getPlantingLocationObjects([
    locationName,
    ...bedNames,
  ]);
  const quantitiesArray = getQuantityObjects(quantities);
  const logCategoriesArray = await getLogCategoryObjects(['transplanting']);

  const cropIdToTermMap = await getCropIdToTermMap();
  const logName =
    dayjs(transplantingDate).format('YYYY-MM-DD') +
    '_xp_' +
    cropIdToTermMap.get(plantAsset.relationships.plant_type[0].id).attributes
      .name;

  const activityLogData = {
    type: 'log--activity',
    attributes: {
      name: logName,
      timestamp: dayjs(transplantingDate).format(),
      status: 'done',
      is_movement: true,
      purchase_date: dayjs(transplantingDate).format(),
    },
    relationships: {
      location: locationsArray,
      asset: [{ type: 'asset--plant', id: plantAsset.id }],
      category: logCategoriesArray,
      quantity: quantitiesArray,
    },
  };

  const farm = await getFarmOSInstance();
  const activityLog = farm.log.create(activityLogData);
  await farm.log.send(activityLog);

  return activityLog;
}

/**
 * Get the transplanting activity log with the specified id.
 *
 * @param {string} activityLogId the id of the transplanting activity log to get.
 * @returns the transplanting activity log with the specified id.
 *
 * @category Transplanting
 */
export async function getTransplantingActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();

  const results = await farm.log.fetch({
    filter: { type: 'log--activity', id: activityLogId },
  });

  return results.data[0];
}

/**
 * Delete the transplanting activity log with the specified id.
 *
 * @param {string} activityLogId the id of the transplanting activity log.
 * @returns {Object} the response from the server.
 * @throws {Error} if unable to delete the transplanting activity log.
 *
 * @category Transplanting
 */
export async function deleteTransplantingActivityLog(activityLogId) {
  const farm = await getFarmOSInstance();

  try {
    const result = await farm.log.delete('activity', activityLogId);
    return result;
  } catch (error) {
    console.error('deleteTransplantingActivityLog:');
    console.error('  Unable to delete activity log with id: ' + activityLogId);
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
