import * as farmosUtil from '../library/farmosUtil/farmosUtil.js';
import { LocalStorage } from 'node-localstorage';

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
 * Get a local storage object that we'll use to simulate the
 * browser's localStorage and sessionStorage when running in node.
 */
let ls = new LocalStorage('scratch');

/*
 * Get a fully initialized and logged in instance of the farmOS.js
 * farmOS object that will be used to write assets, logs, etc.
 */
const farm = await farmosUtil.getFarmOSInstance(URL, client, user, pass, ls);

let logTypes = [];
let schema = farm.schema.get();
for (const recordType in schema) {
  for (const record in schema[recordType]) {
    logTypes.push(recordType + '--' + record);
  }
}

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
