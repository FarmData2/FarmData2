/**
 * @module farmosUtil
 *
 * @description Utility functions for working with a farmOS host.
 *
 * Many of the functions in this module use the
 * [`farmOS.js` library]{@link https://github.com/farmOS/farmOS.js}.
 */

import farmOS from 'farmos';

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

var libLocalStorage = null;
var libSessionStorage = null;

/**
 * Get an instance of the `farmos.js` `farmOS` object that can be used
 * to interact with the farmOS host.  The `farmOS` instance will have the
 * same permissions as the `user`/`pass` that are used for authentication.
 * The default 'farm' client is sufficient for most uses, but any client
 * that exists on the farmOS host can be used (assuming it is properly
 * configured).  The `farmOS` object will also have its schema set.
 *
 * NOTE: There will only be a single instance of `farmOS` object created on the
 * first call to this function from a given page.  Subsequent calls will
 * authenticate if necessary and then return the same`farmOS` object.
 *
 * @param {string} hostURL url of the farmOS instance to which to connect.
 * @param {string} client the farmOS api client to use.
 * @param {string} user the username of the farmOS user to use for authentication.
 * @param {string} pass the farmOS password for the user.
 * @param {object} ls the local storage object to use when running in node. Omit this parameter to use the browser's `localStorage`.
 * @returns the connected and configured `farmos.js` `farmOS` object.
 */
export async function getFarmOSInstance(
  hostURL = 'http://farmos',
  client = 'farm',
  user = 'admin',
  pass = 'admin',
  ls = null
) {
  /*
   * Handle local and session storage here so that the functions
   * in this library can be used in both Node and in the browser
   * (live and w/ Cypress).
   */
  libLocalStorage = ls;
  libSessionStorage = ls;
  if (!ls) {
    libLocalStorage = localStorage;
    libSessionStorage = sessionStorage;
  }

  const config = {
    host: hostURL,
    clientId: client,
    getToken: () => JSON.parse(libLocalStorage.getItem('token')),
    setToken: (token) =>
      libLocalStorage.setItem('token', JSON.stringify(token)),
  };
  const options = { remote: config };

  // Only create a new farm object if we don't already have one in global_farm.
  let newfarm = false;
  if (!global_farm) {
    newfarm = true;

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

  // If we don't have an authentication token cached in localStorage,
  // then authenticate with the farmOS host to get the token.
  if (global_farm.remote.getToken() === null) {
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
  libSessionStorage.removeItem('users');
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns an array of farmOS `user--user` objects.
 */
export async function getUsers(farm) {
  if (global_users) {
    return global_users;
  }

  if (libSessionStorage.getItem('users') != null) {
    global_users = JSON.parse(libSessionStorage.getItem('users'));
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns an `Map` from the user `display_name` to the `user--user` object.
 */
export async function getUsernameToUserMap(farm) {
  const users = await getUsers(farm);

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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns an `Map` from the user `display_name` to the `user--user` object.
 */
export async function getUserIdToUserMap(farm) {
  const users = await getUsers(farm);

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
  libSessionStorage.removeItem('fields_and_beds');
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
 * Get the asset objects for all of the active places that represent fields or beds.
 * These are the assets of type `asset--land` that have `land_type` of either
 * `field` or `bed`.  The fields and beds will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: The result of this function is cached.
 * Use the [`clearCachedFieldsAndBeds`]{@link #module_farmosUtil.clearCachedFieldsAndBeds}
 * function to clear the cache.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a array of all of land assets representing fields or beds.
 */
export async function getFieldsAndBeds(farm) {
  // Done as two requests for now because of a bug in the farmOS.js library.
  // https://github.com/farmOS/farmOS.js/issues/86

  if (global_fields_and_beds) {
    return global_fields_and_beds;
  }

  if (libSessionStorage.getItem('fields_and_beds') != null) {
    global_fields_and_beds = JSON.parse(
      libSessionStorage.getItem('fields_and_beds')
    );
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the field or bed `name` to the `asset--land` object.
 */
export async function getFieldOrBedNameToAssetMap(farm) {
  const fieldsAndBeds = await getFieldsAndBeds(farm);

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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the field or bed `id` to the `asset--land` object.
 */
export async function getFieldOrBedIdToAssetMap(farm) {
  const fieldsAndBeds = await getFieldsAndBeds(farm);

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
  libSessionStorage.removeItem('greenhouses');
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
 * Get the asset objects for all of the active structures that represent greenhouses.
 * These are the assets of type `asset--structure` that have `structure_type` of
 * `greenhouse`.  The greenhouses will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: This function makes an API call to the farmOS host.  Thus,
 * if the array is to be used multiple times it should be cached
 * by the calling code.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns an array of all of land assets representing greenhouses.
 */
export async function getGreenhouses(farm) {
  if (global_greenhouses) {
    return global_greenhouses;
  }

  if (libSessionStorage.getItem('greenhouses') != null) {
    global_greenhouses = JSON.parse(libSessionStorage.getItem('greenhouses'));
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the greenhouse `name` to the `asset--structure` object.
 */
export async function getGreenhouseNameToAssetMap(farm) {
  const greenhouses = await getGreenhouses(farm);

  const map = new Map(greenhouses.map((gh) => [gh.attributes.name, gh]));

  return map;
}

/**
 * Get a map from the id of a greenhouse asset to the
 * farmOS structure asset object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getGreenhouses}.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the greenhouse `id` to the `asset--structure` object.
 */
export async function getGreenhouseIdToAssetMap(farm) {
  const greenhouses = await getGreenhouses(farm);

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
  libSessionStorage.removeItem('crops');
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
 * Get taxonomy term objects for all of the crops.
 * These are the taxonomy terms of type `taxonomy_term--plant_type`.
 * The crops will appear in alphabetical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: This function makes an API call to the farmOS host.  Thus,
 * if the array is to be used multiple times it should be cached
 * by the calling code.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @throws {Error} if unable to fetch the crops.
 * @returns an array of all of taxonomy terms representing crops.
 */
export async function getCrops(farm) {
  if (global_crops) {
    return global_crops;
  }

  if (libSessionStorage.getItem('crops') != null) {
    global_crops = JSON.parse(libSessionStorage.getItem('crops'));
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the crop `name` to the `taxonomy_term--plant_type` object.
 */
export async function getCropNameToTermMap(farm) {
  const crops = await getCrops(farm);

  const map = new Map(crops.map((cr) => [cr.attributes.name, cr]));

  return map;
}

/**
 * Get a map from the id of a crop taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getCrops}.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the crop `id` to the `taxonomy_term--plant_type` object.
 */
export async function getCropIdToTermMap(farm) {
  const crops = await getCrops(farm);

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
  libSessionStorage.removeItem('tray_sizes');
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
 * Get taxonomy term objects for all of the tray sizes.
 * These are the taxonomy terms of type `taxonomy_term--tray_size`.
 * The tray sizes will appear in numerical order
 * by the value of the `attributes.name` property.
 *
 * NOTE: This function makes an API call to the farmOS host.  Thus,
 * if the array is to be used multiple times it should be cached
 * by the calling code.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @throws {Error} if unable to fetch the tray sizes.
 * @returns an array of all of taxonomy terms representing tray sizes.
 */
export async function getTraySizes(farm) {
  if (global_tray_sizes) {
    return global_tray_sizes;
  }

  if (libSessionStorage.getItem('tray_sizes') != null) {
    global_tray_sizes = JSON.parse(libSessionStorage.getItem('tray_sizes'));
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the tray size `name` to the `taxonomy_term--tray-size` object.
 */
export async function getTraySizeToTermMap(farm) {
  const sizes = await getTraySizes(farm);

  const map = new Map(sizes.map((sz) => [sz.attributes.name, sz]));

  return map;
}

/**
 * Get a map from the id of a tray size taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getTraySizes}.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the tray size `id` to the `taxonomy_term--tray_size` object.
 */
export async function getTraySizeIdToTermMap(farm) {
  const sizes = await getTraySizes(farm);

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
  libSessionStorage.removeItem('units');
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
 * Get taxonomy term objects for all of the units.
 * These are the taxonomy terms of type `taxonomy_term--unit`.
 * The units will appear in alphabetical order.
 *
 * NOTE: This function makes an API call to the farmOS host.  Thus,
 * if the array is to be used multiple times it should be cached
 * by the calling code.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @throws {Error} if unable to fetch the units.
 * @returns an array of all of taxonomy terms representing units.
 */
export async function getUnits(farm) {
  if (global_units) {
    return global_units;
  }

  if (libSessionStorage.getItem('units') != null) {
    global_units = JSON.parse(libSessionStorage.getItem('units'));
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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the unit `name` to the `taxonomy_term--unit` object.
 */
export async function getUnitToTermMap(farm) {
  const sizes = await getUnits(farm);

  const map = new Map(sizes.map((unit) => [unit.attributes.name, unit]));

  return map;
}

/**
 * Get a map from the id of a unit taxonomy term to the
 * farmOS taxonomy term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getUnits}.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the unit `id` to the `taxonomy_term--unit` object.
 */
export async function getUnitIdToTermMap(farm) {
  const units = await getUnits(farm);

  const map = new Map(units.map((unit) => [unit.id, unit]));

  return map;
}

/**
 * Get taxonomy term objects for all of the log categories.
 * These are the taxonomy terms of type `taxonomy_term--log_category`.
 * The log categories will appear in alphabetical order.
 *
 * NOTE: This function makes an API call to the farmOS host.  Thus,
 * if the array is to be used multiple times it should be cached
 * by the calling code.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @throws {Error} if unable to fetch the log categories.
 * @returns an array of all of taxonomy terms representing log categories.
 */
export async function getLogCategories(farm) {
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
}

/**
 * Get a map from the name of a log category taxonomy term to the
 * farmOS unit term object.
 *
 * NOTE: The returned `Map` is built on the value returned by {@link #module_farmosUtil.getLogCategories}.
 *
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the log category `name` to the `taxonomy_term--log_category` object.
 */
export async function getLogCategoryToTermMap(farm) {
  const categories = await getLogCategories(farm);

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
 * @param {object} farm a `farmOS` object returned from `getFarmOSInstance`.
 * @returns a `Map` from the log category `id` to the `taxonomy_term--log_category` object.
 */
export async function getLogCategoryIdToTermMap(farm) {
  const categories = await getLogCategories(farm);

  const map = new Map(categories.map((category) => [category.id, category]));

  return map;
}
