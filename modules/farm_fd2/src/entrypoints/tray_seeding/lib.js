import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (assets, quantities and logs) for a tray seeding.
 *
 * @param {Object} formData the form data from the tray seeding form.
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  const farm = await farmosUtil.getFarmOSInstance();

}
