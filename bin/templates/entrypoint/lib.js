import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

/**
 * TODO:
 *  - create the operation objects necessary to create the
 *    logs, assets and quantities needed by the form.
 *  - push each operation object to `ops`.
 *  - Update the JSDoc comments on the `submitForm` function below.
 *  - Complete the tasks in the TODO comments in the template below.
 *  - Delete the TODO comments.
 *  - Delete this comment block.
 */

/**
 * Create the farmOS records (asset, quantities and log) to represent
 * ... TODO: update the description ....
 *
 * @param {Object} formData the form data.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   ... TODO: add attribute names and types. For example...
 *   plantAsset: {asset--plant},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
export async function submitForm(formData) {
  try {
    let ops = [];

    /*
     * TODO: Remove this sampleOp and add operations that create the
     *       logs, assets and quantities needed by the entry point.
     *
     *       See:
     *         - the documentation for the `runTransaction` function in
     *           `libraries/farmosUtil.js` for detailed information about
     *           the operation objects.
     *
     *         - the `modules/farm_fd2/src/entrypoints/tray_seeding/lib.js`
     *           file for examples of using operation objects to create
     *           logs, assets and quantities.
     */
    const sampleOp = {
      name: 'sampleOp',
      do: async () => {
        // Code here does the operation and returns the result.
        console.log(formData);
        console.log('done.');
        return formData;
      },
      undo: async (results) => {
        // Code here undoes the operation if necessary.
        console.log(results);
      },
    };
    // Add the operation to the ops for the transaction.
    ops.push(sampleOp);

    // Run all of the operations in ops as a transaction.
    return await farmosUtil.runTransaction(ops);
  } catch (error) {
    console.error('%ENTRY_POINT% lib.js:');
    console.error(error);

    let errorMsg = 'Error creating %ENTRY_POINT% records.';

    for (const key of Object.keys(error.results)) {
      if (error.results[key]) {
        errorMsg +=
          '\n  Result of operation ' + key + ' could not be cleaned up.';
        if (
          error.results[key].attributes &&
          error.results[key].attributes.name
        ) {
          errorMsg += '\n   Manually delete log or asset with:';
          errorMsg += '\n     name: ' + error.results[key].attributes.name;
        } else {
          errorMsg += '\n   May be safely ignored';
        }
      }
    }

    throw Error(errorMsg, error);
  }
}
