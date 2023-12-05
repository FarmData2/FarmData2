/**
 * @module farmosUtil
 *
 * @description Utility functions for working with a farmOS host.
 *
 * Many of the functions in this module use the
 * [`farmOS.js` library]{@link https://github.com/farmOS/farmOS.js}.
 */

import farmOS from 'farmos';
import * as runExclusive from 'run-exclusive';

/**
 * @private
 *
 * Check if this page from which this function is called is currently
 * running within farmOS or not.  If it is not then it can be assumed
 * that we are running within the development environment.
 *
 * @returns true if the page is within farmOS, false if not.
 */
function inFarmOS() {
  try {
    const pageWrapper = document.getElementsByClassName('page-wrapper');
    return pageWrapper.length > 0;
  } catch (e) {
    return false;
  }
}

/*
 * Ensure that we only create one instance of the farmOS object
 * per page reload.  This is done to avoid fetching the schema
 * every time a farmOS object is needed.
 */
var global_farm = null;

/**
 * Clears the global farm variable.
 *
 * The global farm variable ensures
 * that we only create one instance of the `farmOS` object
 * per page reload.  This is done so that we avoid the cost of
 * fetching the schema every time a `farmOS` object is needed within
 * a page.
 *
 * The primary use case for this function is to allow us to test that a
 * new `farmOS` object is not created every time we call
 * `getFarmOSInstance`.  It could also be useful to force a reload of
 * the schema if that were ever necessary.
 */
export function clearFarmGlobal() {
  global_farm = null;
}

/**
 * @private
 *
 * Get the `global_farm` object.  This is useful for testing to ensure
 * that the global is set at appropriate times.
 *
 * @returns the `global_farm` object
 */
export function getFarmGlobal() {
  return global_farm;
}

/*
 * These two variables will be used throughout to access either the
 * browser's localStorage/sessionStorage or the simulated versions
 * provided by node-localstorage from Node programs that used this
 * library.
 */
var libLocalStorage = null;
var libSessionStorage = null;

/**
 * Create and return an instance of the `farmos.js` `farmOS` object that will be used
 * to interact with the farmOS host.
 *
 * If running within a page served by farmOS itself (e.g. in an entry point in
 * one of the modules) then the credentials (user/pass) are not used.  The farmOS
 * object will have the same permissions as the user that is logged into farmOS.
 *
 * If running outside of farmOS (e.g. from the Vue dev server or a Node program)
 * then the credentials (user/pass) are used to authenticate to the farmOS server
 * so that the API can be accessed.  The farmOS object will have the same
 * permissions as the user/pass that is used to log into farmOS.  By default,
 * this is the `admin` user.
 *
 * The default 'farm' client is sufficient for most uses, but any client
 * that exists on the farmOS host can be used (assuming it is properly
 * configured).  The `farmOS` object will also have its schema set.
 *
 * NOTE: There will only be a single instance of `farmOS` object created on the
 * first call to this function from a given page. Subsequent calls will
 * authenticate if necessary and then return the same`farmOS` object.
 *
 * @param {string} hostURL url of the farmOS instance to which to connect.
 * @param {string} client the farmOS api client to use.
 * @param {string} user the username of the farmOS user to use for authentication.
 * @param {string} pass the farmOS password for the user.
 * @param {object} ls the local/session storage object to use when running in Node. Omit this parameter to use the browser's `localStorage` and `sessionStorage`.
 * @returns the connected and configured `farmos.js` `farmOS` object.
 */
export const getFarmOSInstance = runExclusive.build(
  async (
    hostURL = 'http://farmos',
    client = 'farm',
    user = 'admin',
    pass = 'admin',
    ls = null
  ) => {
    /*
     * Note: runExclusive (https://www.npmjs.com/package/run-exclusive)
     * is used to prevent concurrent execution of this function.  This eliminates
     * a race condition that allows the construction of multiple farmOS
     * objects by different components.
     */

    /*
     * Handle local and session storage here so that the functions
     * in this library can be used in both Node and in the browser
     * (live and w/ Cypress).
     */
    if (!libLocalStorage) {
      libLocalStorage = ls;
      libSessionStorage = ls;
      if (!ls) {
        libLocalStorage = localStorage;
        libSessionStorage = sessionStorage;
      }
    }

    // Only create a new farm object if we don't already have one in global_farm.
    let newfarm = false;
    if (!global_farm) {
      newfarm = true;

      let config = {};
      if (inFarmOS()) {
        // Get the CSRF token needed for requests that modify data
        // when we are running inside farmOS.
        const response = await fetch('http://farmos/session/token');
        const csrfToken = await response.text();

        // Similar to: https://gist.github.com/paul121/26bed0987b73c6886fa3a0743c0f47eb
        config = {
          host: '',
          clientId: client,
          auth: (request) => {
            request.interceptors.request.use((config) => {
              if (config.method === 'get') {
                // Don't add CSRF  header to GET requests as it can leak the token.
                // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
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
      } else {
        config = {
          host: hostURL,
          clientId: client,
          getToken: () => JSON.parse(libLocalStorage.getItem('token')),
          setToken: (token) =>
            libLocalStorage.setItem('token', JSON.stringify(token)),
        };
      }
      const options = { remote: config };

      /*
       * Enable this to be used both in Node, where farmOS is
       * not recognized but farmOS.default is and in Cypress for
       * testing where farmOS is recognized, but farmOS.default
       * is not.
       */
      if (typeof farmOS != 'function') {
        global_farm = farmOS.default(options);
      } else {
        global_farm = farmOS(options);
      }
    }

    // If we are running outside of farmOS and we
    // don't have an authentication token cached in localStorage,
    // then authenticate with the farmOS host to get the token.
    if (!inFarmOS() && global_farm.remote.getToken() === null) {
      await global_farm.remote.authorize(user, pass);
    }

    // Only set the schema if this is a new farm object.
    if (newfarm) {
      //Try the session storage first...
      let schema = JSON.parse(libSessionStorage.getItem('schema'));
      if (schema == null) {
        // Not in session storage, so fetch schema from the farmOS host.
        await global_farm.schema.fetch();
        schema = global_farm.schema.get();
        // Cache in the session storage for next time.
        libSessionStorage.setItem('schema', JSON.stringify(schema));
      }
      await global_farm.schema.set(schema);
    }

    return global_farm;
  }
);

/**
 * Add the user specified by the `ownerID` to the `obj` as the owner
 * of the asset or log.
 *
 * This pushes an `user--user` object to the `relationships.owner` property of `obj`.
 *
 * @param {object} obj a farmOS asset or log.
 * @param {string} ownerId the id of the user to assign as the owner.
 * @throws {ReferenceError} if the `obj` does not have a `relationships.owner` property.
 * @return the `obj` with the owner added.
 */
export function addOwnerRelationship(obj, ownerId) {
  if (!obj?.relationships.owner) {
    throw new ReferenceError(
      'The obj parameter does not have a relationships.owner property'
    );
  } else {
    obj.relationships.owner.push({
      type: 'user--user',
      id: ownerId,
    });
  }

  return obj;
}

/**
 * Add the user specified by the `parentID` to the `obj` as the parent
 * of the asset or log.
 *
 * @param {object} obj a farmOS asset or log.
 * @param {string} parentId the id of the user to assign as the parent.
 * @throws {ReferenceError} if the `obj` does not have a `relationships.parent` property.
 * @returns the `obj` with the parent added.
 */
export function addParentRelationship(obj, parentId, parentType) {
  if (!obj?.relationships.parent) {
    throw new ReferenceError(
      'The obj parameter does not have a relationships.parent property'
    );
  } else {
    obj.relationships.parent.push({
      type: parentType,
      id: parentId,
    });
  }

  return obj;
}

/**
 * Print out the JSON structure of the specified farmOS record type.
 * (e.g. asset--land, log--harvest, etc...  This is useful as a development
 * and debugging tool.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @param {string} recordType the type of farmOS record to display.
 */
export function printObject(farm, recordType) {
  const obj = farm.log.create({ type: recordType });
  console.dir(obj);
}

// Used to cache result of the getUsers function.
var global_users = null;

/**
 * Clear the cached results from prior calls to the `getUsers` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedUsers() {
  global_users = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('users');
  }
}

/**
 * @private
 *
 * Get the `global_users` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_users` object
 */
export function getGlobalUsers() {
  return global_users;
}

/**
 * @private
 *
 * Clear the `global_users` object.  This is useful for testing to ensure
 * that the global is not set by prior tests.
 */
export function clearGlobalUsers() {
  global_users = null;
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
 * @returns an array of farmOS `user--user` objects.
 */
export async function getUsers() {
  if (global_users) {
    return global_users;
  }

  const farm = await getFarmOSInstance();

  const usersSS = libSessionStorage.getItem('users');
  if (usersSS) {
    global_users = JSON.parse(usersSS);
    return global_users;
  }

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

  libSessionStorage.setItem('users', JSON.stringify(users.data));
  global_users = users.data;
  return global_users;
}

/**
 * Get a map from the user 'display_name` to the corresponding
 * farmOS user object.
 *
 * NOTE: The returned `Map` is built on the value returned by
 * [getUsers]{@link #module_farmosUtil.getUsers}.
 *
 * @returns an `Map` from the user `display_name` to the `user--user` object.
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
 * NOTE: The returned `Map` is built on the value returned by
 * [getUsers]{@link #module_farmosUtil.getUsers}.
 *
 * @returns an `Map` from the user `display_name` to the `user--user` object.
 */
export async function getUserIdToUserMap() {
  const users = await getUsers();

  const map = new Map(users.map((user) => [user.id, user]));

  return map;
}

// Used to cache result of the getFieldsAndBeds function.
var global_fields_and_beds = null;

/**
 * Clear the cached results from prior calls to the `getFieldsAndBeds` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedFieldsAndBeds() {
  global_fields_and_beds = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('fields_and_beds');
  }
}

/**
 * @private
 *
 * Get the `global_fields_and_beds` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_fields_and_beds` object
 */
export function getGlobalFieldsAndBeds() {
  return global_fields_and_beds;
}

/**
 * @private
 *
 * Clear the `global_fields_and_beds` object.  This is useful for testing to ensure
 * that the global is not set prior to the test.
 */
export function clearGlobalFieldsAndBeds() {
  global_fields_and_beds = null;
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
 * @returns a array of all of land assets representing fields or beds.
 */
export async function getFieldsAndBeds() {
  // Done as two requests for now because of a bug in the farmOS.js library.
  // https://github.com/farmOS/farmOS.js/issues/86

  if (global_fields_and_beds) {
    return global_fields_and_beds;
  }

  const farm = await getFarmOSInstance();

  const fieldsAndBedsSS = libSessionStorage.getItem('fields_and_beds');
  if (fieldsAndBedsSS) {
    global_fields_and_beds = JSON.parse(fieldsAndBedsSS);
    return global_fields_and_beds;
  }

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

  libSessionStorage.setItem('fields_and_beds', JSON.stringify(land));
  global_fields_and_beds = land;
  return global_fields_and_beds;
}

/**
 * Get a map from the name of a field or bed land asset to the
 * farmOS land asset object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getFieldsAndBeds}.
 *
 * @returns a `Map` from the field or bed `name` to the `asset--land` object.
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
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getFieldsAndBeds}.
 *
 * @returns a `Map` from the field or bed `id` to the `asset--land` object.
 */
export async function getFieldOrBedIdToAssetMap() {
  const fieldsAndBeds = await getFieldsAndBeds();

  const map = new Map(fieldsAndBeds.map((land) => [land.id, land]));

  return map;
}

// Used to cache result of the getGreenhouses function.
var global_greenhouses = null;

/**
 * Clear the cached results from prior calls to the `getGreenhouses` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedGreenhouses() {
  global_greenhouses = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('greenhouses');
  }
}

/**
 * @private
 *
 * Get the `global_greenhouses` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_greenhouses` object
 */
export function getGlobalGreenhouses() {
  return global_greenhouses;
}

/**
 * @private
 *
 * Clear the `global_greenhouses` object.  This is useful for testing to ensure
 * that the global is not set prior to the test.
 */
export function clearGlobalGreenhouses() {
  global_greenhouses = null;
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
 * @returns an array of all of land assets representing greenhouses.
 */
export async function getGreenhouses() {
  if (global_greenhouses) {
    return global_greenhouses;
  }

  const farm = await getFarmOSInstance();

  const greenHousesSS = libSessionStorage.getItem('greenhouses');
  if (greenHousesSS) {
    global_greenhouses = JSON.parse(greenHousesSS);
    return global_greenhouses;
  }

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

  libSessionStorage.setItem('greenhouses', JSON.stringify(greenhouses.data));
  global_greenhouses = greenhouses.data;
  return global_greenhouses;
}

/**
 * Get a map from the name of a greenhouse asset to the
 * farmOS structure asset object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getGreenhouses}.
 *
 * @returns a `Map` from the greenhouse `name` to the `asset--structure` object.
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
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getGreenhouses}.
 *
 * @returns a `Map` from the greenhouse `id` to the `asset--structure` object.
 */
export async function getGreenhouseIdToAssetMap() {
  const greenhouses = await getGreenhouses();

  const map = new Map(greenhouses.map((gh) => [gh.id, gh]));

  return map;
}

// Used to cache result of the getCrops function.
var global_crops = null;

/**
 * Clear the cached results from prior calls to the `getCrops` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedCrops() {
  global_crops = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('crops');
  }
}

/**
 * @private
 *
 * Get the `global_crops` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_crops` object
 */
export function getGlobalCrops() {
  return global_crops;
}

/**
 * @private
 *
 * Clear the `global_crops` object.  This is useful for testing to ensure
 * that the global is not set prior to the test.
 */
export function clearGlobalCrops() {
  global_crops = null;
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
 * @returns an array of all of taxonomy terms representing crops.
 */
export async function getCrops() {
  if (global_crops) {
    return global_crops;
  }

  const farm = await getFarmOSInstance();

  const cropsSS = libSessionStorage.getItem('crops');
  if (cropsSS) {
    global_crops = JSON.parse(cropsSS);
    return global_crops;
  }

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

  libSessionStorage.setItem('crops', JSON.stringify(crops.data));
  global_crops = crops.data;
  return global_crops;
}

/**
 * Get a map from the name of a crop taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getCrops}.
 *
 * @returns a `Map` from the crop `name` to the `taxonomy_term--plant_type` object.
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
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getCrops}.
 *
 * @returns a `Map` from the crop `id` to the `taxonomy_term--plant_type` object.
 */
export async function getCropIdToTermMap() {
  const crops = await getCrops();

  const map = new Map(crops.map((cr) => [cr.id, cr]));

  return map;
}

// Used to cache result of the getTraySizes function.
var global_tray_sizes = null;

/**
 * Clear the cached results from prior calls to the `getTraySizes` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedTraySizes() {
  global_tray_sizes = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('tray_sizes');
  }
}

/**
 * @private
 *
 * Get the `global_tray_sizes` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_tray_sizes` object
 */
export function getGlobalTraySizes() {
  return global_tray_sizes;
}

/**
 * @private
 *
 * Clear the `global_tray_sizes` object.  This is useful for testing to ensure
 * that the global is not set prior to the test.
 */
export function clearGlobalTraySizes() {
  global_tray_sizes = null;
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
 * @returns an array of all of taxonomy terms representing tray sizes.
 */

export async function getTraySizes() {
  if (global_tray_sizes) {
    return global_tray_sizes;
  }

  const farm = await getFarmOSInstance();

  let traySizesSS = libSessionStorage.getItem('tray_sizes');
  if (traySizesSS) {
    global_tray_sizes = JSON.parse(traySizesSS);
    return global_tray_sizes;
  }

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

  libSessionStorage.setItem('tray_sizes', JSON.stringify(traySizes.data));
  global_tray_sizes = traySizes.data;
  return global_tray_sizes;
}

/**
 * Get a map from the name of a tray size taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getTraySizes}.
 *
 * @returns a `Map` from the tray size `name` to the `taxonomy_term--tray-size` object.
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
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getTraySizes}.
 *
 * @returns a `Map` from the tray size `id` to the `taxonomy_term--tray_size` object.
 */
export async function getTraySizeIdToTermMap() {
  const sizes = await getTraySizes();

  const map = new Map(sizes.map((sz) => [sz.id, sz]));

  return map;
}

// Used to cache result of the getUnits function.
var global_units = null;

/**
 * Clear the cached results from prior calls to the `getUnits` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedUnits() {
  global_units = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('units');
  }
}

/**
 * @private
 *
 * Get the `global_units` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_units` object
 */
export function getGlobalUnits() {
  return global_units;
}

/**
 * @private
 *
 * Clear the `global_units` object.  This is useful for testing to ensure
 * that the global is not set prior to the test.
 */
export function clearGlobalUnits() {
  global_units = null;
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
 * @returns an array of all of taxonomy terms representing units.
 */
export async function getUnits() {
  if (global_units) {
    return global_units;
  }

  const farm = await getFarmOSInstance();

  const unitsSS = libSessionStorage.getItem('units');
  if (unitsSS) {
    global_units = JSON.parse(unitsSS);
    return global_units;
  }

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

  libSessionStorage.setItem('units', JSON.stringify(units.data));
  global_units = units.data;
  return global_units;
}

/**
 * Get a map from the name of a unit taxonomy term to the
 * farmOS unit term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getUnits}.
 *
 * @returns a `Map` from the unit `name` to the `taxonomy_term--unit` object.
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
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getUnits}.
 *
 * @returns a `Map` from the unit `id` to the `taxonomy_term--unit` object.
 */
export async function getUnitIdToTermMap() {
  const units = await getUnits();

  const map = new Map(units.map((unit) => [unit.id, unit]));

  return map;
}

// Used to cache result of the getLogCategories function.
var global_log_categories = null;

/**
 * Clear the cached results from prior calls to the `getLogCategories` function.
 * This is useful when an action may change the users that exist in the
 * system
 */
export function clearCachedLogCategories() {
  global_log_categories = null;
  if (libSessionStorage) {
    libSessionStorage.removeItem('log_categories');
  }
}

/**
 * @private
 *
 * Get the `global_units` object.  This is useful for testing to ensure
 * that the global is set by the appropriate functions.
 *
 * @returns the `global_units` object
 */
export function getGlobalLogCategories() {
  return global_log_categories;
}

/**
 * @private
 *
 * Clear the `global_units` object.  This is useful for testing to ensure
 * that the global is not set prior to the test.
 */
export function clearGlobalLogCategories() {
  global_log_categories = null;
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
 * @returns an array of all of taxonomy terms representing log categories.
 */
export async function getLogCategories() {
  if (global_log_categories) {
    return global_log_categories;
  }

  const farm = await getFarmOSInstance();

  const logCategoriesSS = libSessionStorage.getItem('log_categories');
  if (logCategoriesSS) {
    global_log_categories = JSON.parse(logCategoriesSS);
    return global_log_categories;
  }

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

  libSessionStorage.setItem('log_categories', JSON.stringify(categories.data));
  global_log_categories = categories.data;
  return global_log_categories;
}

/**
 * Get a map from the name of a log category taxonomy term to the
 * farmOS unit term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getLogCategories}.
 *
 * @returns a `Map` from the log category `name` to the `taxonomy_term--log_category` object.
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
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getLogCategories}.
 *
 * @returns a `Map` from the log category `id` to the `taxonomy_term--log_category` object.
 */
export async function getLogCategoryIdToTermMap() {
  const categories = await getLogCategories();

  const map = new Map(categories.map((category) => [category.id, category]));

  return map;
}
