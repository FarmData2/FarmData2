/*
 * Utility functions for getting and working with seedlings.
 */

import { getFarmOSInstance } from './farmosUtil.core.js';
import { extractQuantity } from './farmosUtil.extractQuantity.js';

/**
 * Get information about all of the seedlings that are candidates for transplanting.
 * These seedlings are plant assets that were tray seeded and have a positive inventory of trays.
 *
 * This function returns an array of objects with the following content:
 * ```json
 * {
 *  log_id: <id of seeding log created by the seeding>,
 *  log_uuid: <uuid of seeding log created by the seeding>,
 *  asset_id: <id of plant asset created by the seeding>,
 *  asset_uuid: <uuid of plant asset created by the seeding>,
 *  date: <date of tray seeding>,
 *  user: <name of user that entered the seeding>,
 *  crop: <name of crop that was seeded>,
 *  trays_location: <name of location where trays are>,
 *  asset_locations: <names of locations where crop has been transplanted thus far>,
 *  total_trays: <total number of trays seeded>
 *  available_trays: <number of trays available for transplanting>
 *  tray_size: <size of trays that were seeded>,
 *  seeds_per_cell: <number of seeds in each tray cell>,
 *  total_seeds: <total number of seeds used>
 *  notes: <notes attached to the seeding log and the plant asset>
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
    console.error('  Unable to GET seedlings information.');
    console.error(error.message);
    console.error(error);
    throw new Error('Unable to fetch seedlings.', error);
  }
}

/**
 * Gets a list of the crop names of all crops that are eligible for
 * transplanting. These are the names of all crops associated with
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
    console.error('  Unable to GET tray seeded crop names.');
    console.error(error.message);
    console.error(error);
    throw new Error('Unable to fetch tray seeded crop names.', error);
  }
}
