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

// Export core logic for connection management and caching.
export * from './farmosUtil.core.js';

// Export standalone utility for parsing quantity strings.
export * from './farmosUtil.extractQuantity.js';

// Export standalone utility for reading asset inventory.
export * from './farmosUtil.inventory.js';

// Export standalone utility for transactional operations.
export * from './farmosUtil.transaction.js';

// Export functions related to bed assets.
export * from './farmosUtil.beds.js';

// Export functions related to crop taxonomy terms.
export * from './farmosUtil.crops.js';

// Export functions related to equipment assets.
export * from './farmosUtil.equipment.js';

// Export functions related to field assets.
export * from './farmosUtil.fields.js';

// Export functions related to greenhouse assets.
export * from './farmosUtil.greenhouses.js';

// Export functions related to log category taxonomy terms.
export * from './farmosUtil.logCategories.js';

// Export functions related to user permissions.
export * from './farmosUtil.permissions.js';

// Export functions related to tray size taxonomy terms.
export * from './farmosUtil.traySizes.js';

// Export functions related to unit taxonomy terms.
export * from './farmosUtil.units.js';

// Export functions related to farmOS users.
export * from './farmosUtil.users.js';

// Export helper functions for building data structures.
export * from './farmosUtil.utilities.js';

// Export functions related to plant assets.
export * from './farmosUtil.plant.js';

// Export functions related to quantity records.
export * from './farmosUtil.quantity.js';

// Export functions related to seeding logs.
export * from './farmosUtil.seeding.js';

// Export functions related to retrieving seedlings.
export * from './farmosUtil.seedlings.js';

// Export functions related to soil disturbance logs.
export * from './farmosUtil.soil.js';

// Export functions related to soil disturbance termination logs.
export * from './farmosUtil.soilDisturbanceTerminationLog.js';

// Export functions related to transplanting logs.
export * from './farmosUtil.transplanting.js';

// Export functions related to winter kill logs.
export * from './farmosUtil.winterKill.js';
