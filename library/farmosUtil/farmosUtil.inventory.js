/*
 * Utility functions for getting and working with inventory.
 */

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
