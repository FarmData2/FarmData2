/*
 * Utility functions for getting and working with core.
 *
 * Core utility functions for working with a farmOS host. This is the
 * foundational piece of the library, handling instance management, caching,
 * and authentication. It is a direct copy of the original `farmosUtil.js`
 * logic, with only the necessary exports added for modularization.
 */

import farmOS from 'farmos';
import * as runExclusive from 'run-exclusive';

/*
 * This global object holds all of the values that are cached in the
 * session storage by this library. These are object that require
 * communication with the farmOS server. They are cached to prevent
 * the overhead of repeated API calls for the same information.
 *
 * Things cached in this global are cached in the sessionStorage
 * also.
 */
var fd2Cache = {
  /*
   * The global farm variable ensures
   * that we only create one instance of the `farmOS` object
   * per page reload. This is done so that we avoid the cost of
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
 * running within farmOS or not. If it is not then it can be assumed
 * that we are running within the development environment (e.g. from
 * Node or from the dev server).
 *
 * This is used by the `getFarmOSInstance` function so that it can determine
 * the type type of farmOS object that is needed at runtime. This enables
 * the same front end code to run in farmOS, in Node and in the dev server.
 *
 * @returns {boolean} true if the page is within farmOS, false if not.
 */
export function inFarmOS() {
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
 * The primary use case for this function is in testing. For example,
 * it allow us to test that the `farmOS` object is cached both in a
 * global variable and in the `sessionStorage`. It could also be useful
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
 * While this is documented as an `object`, `getFarmOSInstance` is called as a function. See
 * the example at the top of the documentation. This is because `getFarmOSInstance` uses the
 * `runExclusive` library to prevent race conditions.
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
     * is used to prevent concurrent execution of this function. This eliminates
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
      if (hostURL && client && user && pass) {
        /*
         * We have been called from a test that provides specific credentials.
         * Create a new farmOS object with the credentials.
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
 * is served from farmOS. This instance will have the same permissions as
 * the currently logged in user. It will use a CSRF token for operations
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
    const csrfToken = await response.text(); // Similar to: https://gist.github.com/paul121/26bed0987b73c6886fa3a0743c0f47eb

    const config = {
      host: '',
      clientId: 'farm',
      auth: (request) => {
        request.interceptors.request.use((config) => {
          if (config.method === 'get') {
            /*
             * Don't add CSRF header to GET requests as it can leak the token.
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
  } // Only create a new farm object if we don't already have one in global_farm.

  let newFarm = false;
  if (!fd2Cache.farm) {
    newFarm = true;
    // Create a new farmOS instance using the default credentials if none are provided.

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
   * then authenticate with the farmOS host to get the token. We may
   * be changing users as well so clear the permissions if they were
   * cached.
   */

  if (fd2Cache.farm.remote.getToken() === null) {
    clearCachedValue('permissions');
    await fd2Cache.farm.remote.authorize(user, pass);
  } // If we created a new farm object then we need to get the schema.

  if (newFarm) {
    await setFarmSchema(fd2Cache.farm);
  }

  return fd2Cache.farm;
}

/**
 * @private
 *
 * Get the farmOS schema from the session storage (if it exists there)
 * or from the farmOS host. If we get it from the farmOS host then place
 * it in the session storage for next time.
 */
export async function setFarmSchema(farm) {
  let schema = JSON.parse(libSessionStorage.getItem('schema'));
  if (schema == null) {
    await farm.schema.fetch();
    schema = farm.schema.get();
    libSessionStorage.setItem('schema', JSON.stringify(schema));
  } else {
    await farm.schema.set(schema);
  }
}

/**
 * Print out the JSON structure of the specified farmOS record type.
 * (e.g. asset--land, log--harvest, etc...
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
 * given key. If the value is found in either cache, it is returned. Otherwise
 * the fetchFunction is called. The value returned by the fetchFunction is then
 * cached in both the fd2Cache variable and the sessionStorage and is then returned.
 *
 * @param {String} key the key associated with the value being fetched.
 * @param {Function} fetchFunction a function that fetches the value from the
 * farmOS API if necessary.
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
   * We don't necessarily need a farmOS object here but we need
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

  return fromAPI;
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
