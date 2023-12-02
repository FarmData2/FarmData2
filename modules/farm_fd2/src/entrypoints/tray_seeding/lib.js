import * as farmosUtil from '@libs/farmosUtil/farmosUtil';
/**
 * Create the farmOS records (assets, quantities and logs) for a tray seeding.
 *
 * @param {Object} formData the form data from the tray seeding form.
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  //console.log(formData);

  // gets the csrf token
  // but probably don't need this because seems like farmos.js must do it.
  //const response = await fetch('http://farmos/session/token');
  //const csrfToken = await response.text();
  //console.log(csrfToken);

  // const response = await fetch('http://farmos/api/taxonomy_term/unit', 
  //  {
  //  method: 'GET',
  //   mode: 'same-origin',
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/vnd.api+json',
  //   },
  // },
  // );
  // const info = await response.json();
  // console.dir(info);

  //const farm = await farmosUtil.getFarmOSInstance();

  const users = await farmosUtil.getUsers();
  console.dir(users);
}
