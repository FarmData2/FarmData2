/** @module farmosUtil */

import * as farmosUtil from './farmosUtil.js';

/*
 * Setup the information for connecting to the farmOS instance
 * in the FarmData2 development environment.  Note: URL cannot
 * have a trailing /.
 */
const URL = 'http://farmos';
const client = 'farm';
const user = 'admin';
const pass = 'admin';

/*
 * Get a fully initialized and logged in instance of the farmOS.js
 * farmOS object that will be used to write assets, logs, etc.
 */
const farm = await farmosUtil.getFarmOSInstance(URL, client, user, pass);

const logTypes = [
  'asset--water',
  'asset--animal',
  'asset--equipment',
  'asset--plant',
  'asset--land',
  'asset--structure',
  'file--file',
  'log--input',
  'log--observation',
  'log--maintenance',
  'log--activity',
  'log--harvest',
  'log--seeding',
  'quantity--material',
  'quantity--standard',
  'taxonomy_term--animal_type',
  'taxonomy_term--material_type',
  'taxonomy_term--season',
  'taxonomy_term--log_category',
  'taxonomy_term--crop_family',
  'taxonomy_term--unit',
  'taxonomy_term--plant_type',
  'user--user',
];

// eslint-disable-next-line no-undef
let types = process.argv.slice(2);
if (types.length === 0) {
  console.log('List log types to print or use all.');
  console.log('  node printFarmosLogs user--user asset--land');
  console.log('');
  console.log('Log types: ');
  for (const logType of logTypes) {
    console.log('  ' + logType);
  }
} else {
  if (types[0] == 'all') {
    types = logTypes;
  }

  for (const logType of types) {
    if (!logTypes.includes(logType)) {
      console.log('\n\nSkipping unknown log type: ' + logType);
    } else {
      console.log('\n\n' + logType + ':');
      farmosUtil.printObject(farm, logType);
    }
  }
}
