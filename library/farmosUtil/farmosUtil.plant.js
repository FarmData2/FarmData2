/*
 * Utility functions for getting and working with plant.
 */

import { getFarmOSInstance } from './farmosUtil.core.js';
import { getCropNameToTermMap } from './farmosUtil.crops.js';

/**
 * Create a plant asset (i.e. an asset of type `asset--plant`).
 *
 * @param {string} date the date on which the plant asset was created.
 * @param {string|string[]} cropName - The name of the crop(s) to associate with the plant asset.
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

  const assetName =
    date + '_' + (Array.isArray(cropName) ? cropName.join('_') : cropName); // Determine plant types

  const plantTypes = Array.isArray(cropName)
    ? cropName.map((name) => ({
        type: 'taxonomy_term--plant_type',
        id: cropMap.get(name).id,
      }))
    : [{ type: 'taxonomy_term--plant_type', id: cropMap.get(cropName).id }]; // create an asset--plant

  const plantAsset = farm.asset.create({
    type: 'asset--plant',
    attributes: {
      name: assetName,
      status: 'active',
      notes: { value: comment },
    },
    relationships: {
      plant_type: plantTypes,
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
 * Get plant assets by location, beds and whether they
 * are in trays or in the ground.
 *
 * This function returns an array of objects with the following content:
 * ```json
 * {
 *  uuid: <id of a seeding log>,
 *  crop: <array of name(s) of the crop(s) in the plant asset>,
 *  created_by: <array of log categories for logs that created the plant asset>,
 *  timestamp: <date of event (log) that created the plant asset>,
 *  location: <location of the plant asset>,
 *  beds: <array of bed name(s) (within location) where plant asset is located>,
 * }
 * ```
 *
 * @param {string} locationName the location of the plant assets.
 * @param {string[]} [checkedBeds=[]] the beds of the plant assets.
 * @param {boolean} [isInGround=true] include plants that are in the ground (direct seeded or transplanted).
 * @param {boolean} [isInTrays=true] include plants that are in trays (tray seeded but not transplanted).
 * @return {Object[]} array of objects with information about the matching plant assets.
 * @throws {Error} if unable to fetch the plant assets.
 *
 * @category Plant
 */
export async function getPlantAssets(
  locationName,
  checkedBeds = [],
  isInTrays = true,
  isInGround = true
) {
  if (!isInTrays && !isInGround) {
    return [];
  }

  const farm = await getFarmOSInstance();

  let paramStr = '?location=' + locationName;
  if (checkedBeds.length > 0) {
    paramStr = paramStr + '&beds=' + checkedBeds.join(',');
  }

  let logCategories = [];
  if (isInTrays) {
    logCategories.push('seeding_tray');
  }
  if (isInGround) {
    logCategories.push('seeding_direct');
    logCategories.push('seeding_cover_crop');
    logCategories.push('transplanting');
  }
  if (logCategories.length > 0) {
    paramStr = paramStr + '&log-categories=' + logCategories.join(',');
  }

  const url = '/api/fd2_plant_assets' + paramStr;
  const results = await farm.remote.request(url); // If no matches, then data will be an array in the response.

  if (Array.isArray(results.data)) {
    for (const result of results.data) {
      result.crop = result.crop.split(',');
      result.created_by = result.created_by.split(',');
      if (result.beds === '') {
        result.beds = [];
      } else {
        result.beds = result.beds.split(',');
      }
    }
    return results.data;
  } else {
    return [];
  }
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
    console.error('  Unable to delete plant asset with id: ' + plantAssetId);
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
 *
 * @category Plant
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
