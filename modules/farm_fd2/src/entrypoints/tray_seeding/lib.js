import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * Create the farmOS records (assets, quantities and logs) for a tray seeding.
 *
 * @param {Object} formData the form data from the tray seeding form.
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {

  const farm = await farmosUtil.getFarmOSInstance();

  const p1 = {
    type: 'log--activity',
    name: 'did some stuff',
    notes: 'initial note',
  };
  console.log('create first log');
  const a1 = farm.log.create(p1);
  await farm.log.send(a1);
  console.log('done');

  console.log('delete first log');
  await farm.log.delete('activity', a1.id);
  console.log('done');

  const p2 = {
    type: 'log--activity',
    name: 'did some more stuff',
    notes: 'another note',
  };
  console.log('create a second log');
  const a2 = farm.log.create(p2);
  await farm.log.send(a2);
  console.log('done');

  console.log('Try to update log');
  const updateProps = {
    notes: 'An updated note',
    status: 'done',
  };
  const updateLog = farm.log.update(a2, updateProps);
  await farm.log.send(updateLog);
  console.log('done');
}
