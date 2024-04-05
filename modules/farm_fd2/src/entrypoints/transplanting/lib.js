import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * the transplanted trays.
 *
 * @param {Object} formData the form data from the transplanting form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   plantAsset: {asset--plant},
 * 
 *   TODO: FILL THIS IN LATER...
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  try {
    // create the plant asset
    // Asset from each row as a parent

    // create the transplanting activity log
    // Quantity from each row as inventory decrement

    // archive the original plant asset if inventory == 0

    // create the soil disturbance activity log
  }
  catch (error) {
    // delete anything that was created
    // throw an error.
  }
}
