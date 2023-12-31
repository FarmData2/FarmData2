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
  fields_and_beds: null,
  greenhouses: null,
  crops: null,
  tray_sizes: null,
  units: null,
  log_categories: null,
  permissions: null,
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
 * Clear the cached results from prior calls to the `getFieldsAndBeds` function.
 * This is useful when an action may change the fields and beds that exist in the
 * system
 *
 * @category FieldsAndBeds
 */
export function clearCachedFieldsAndBeds() {
  clearCachedValue('fields_and_beds');
}

/**
 * Get the asset objects for all of the active places that represent fields or beds.
 * These are the assets of type `asset--land` that have `land_type` of either
 * `field` or `bed`.  The fields and beds will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedFieldsAndBeds`]{@link #module_farmosUtil.clearCachedFieldsAndBeds}
 * function to clear the cache.
 *
 * @throws {Error} if unable to fetch the fields and beds.
 * @returns {Array<Object>} a array of all of land assets representing fields or beds.
 *
 * @category FieldsAndBeds
 */
export async function getFieldsAndBeds() {
  return fetchWithCaching('fields_and_beds', async () => {
    const farm = await getFarmOSInstance();

    // Done as two requests for now because of a bug in the farmOS.js library.
    // https://github.com/farmOS/farmOS.js/issues/86

    const beds = await farm.asset.fetch({
      filter: {
        type: 'asset--land',
        land_type: 'bed',
        status: 'active',
      },
      limit: Infinity,
    });

    const fields = await farm.asset.fetch({
      filter: {
        type: 'asset--land',
        land_type: 'field',
        status: 'active',
      },
      limit: Infinity,
    });

    const rejects = fields.rejected.concat(beds.rejected);
    if (rejects.length != 0) {
      throw new Error('Unable to fetch fields and beds.', rejects);
    }

    const land = fields.data.concat(beds.data);
    land.sort((o1, o2) => o1.attributes.name.localeCompare(o2.attributes.name));

    return land;
  });
}

/**
 * Get a map from the name of a field or bed land asset to the
 * farmOS land asset object.
 *
 * NOTE: This function makes a call to
 * [`getFieldsAndBeds`]{@link #module_farmosUtil.getFieldsAndBeds}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the fields and beds.
 * @returns {Map<String,Object>} a `Map` from the field or bed `name` to the `asset--land` object.
 *
 * @category FieldsAndBeds
 */
export async function getFieldOrBedNameToAssetMap() {
  const fieldsAndBeds = await getFieldsAndBeds();
  const map = new Map(
    fieldsAndBeds.map((land) => [land.attributes.name, land])
  );
  return map;
}

/**
 * Get a map from the id of a field or bed land asset to the
 * farmOS land asset object.
 *
 * NOTE: This function makes a call to
 * [`getFieldsAndBeds`]{@link #module_farmosUtil.getFieldsAndBeds}
 * and builds the `Map` using the returned `Array<Object>`.
 *
 * @throws {Error} if unable to fetch the fields and beds.
 * @returns {Map<String,Object>} a `Map` from the field or bed `id` to the `asset--land` object.
 *
 * @category FieldsAndBeds
 */
export async function getFieldOrBedIdToAssetMap() {
  const fieldsAndBeds = await getFieldsAndBeds();
  const map = new Map(fieldsAndBeds.map((land) => [land.id, land]));
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
  const sizes = await getUnits();
  const map = new Map(sizes.map((unit) => [unit.attributes.name, unit]));
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
 * @category LogCategories
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
