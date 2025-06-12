/*
 * Utility functions for getting and working with quantity.
 */

import { getFarmOSInstance } from './farmosUtil.core.js';
import { getUnitToTermMap } from './farmosUtil.units.js';

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
  const unitMap = await getUnitToTermMap(); // create the necessary quantities

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
      '  Unable to delete standard quantity with id: ' + quantityId
    );
    console.error(error.message);
    console.error(error);
    throw error;
  }
}
