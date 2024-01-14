import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
import dayjs from 'dayjs';

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * a directseeding.
 *
 * @param {Object} formData the form data from the direct seeding form.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   plantAsset: {asset--plant},
 *   bedFeet: {quantity--standard},
 *   rowsPerBed: {quantity--standard},
 *   bedWidth: {quantity--standard},
 *   seedingLog: {log--seeding},
 *   equipment: [ {asset--equipment} ],
 *   depth: {quantity--standard},
 *   speed: {quantity--standard},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  let plantAsset = null;
  let traysQuantity = null;
  let traySizeQuantity = null;
  let seedsQuantity = null;
  let seedingLog = null;