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
 * @param {Object} form the form containing the data from the entry point.
 * @returns {Promise} a promise that resolves when the records are successfully created.
 * The returned value is an object containing the asset, quantities and log that
 * were sent to the server.  This object has the following properties:
 * ```Javascript
 * {
 *   ... TODO: add attribute names and types. For example...
 *   sampleOp: {log--seeding},
 * }
 * ```
 * @throws {Error} if an error occurs while creating the farmOS records.
 */
async function submitForm(form) {
  try {
    let ops = [];

    /*
     * This sampleOP creates a plant asset to illustrate how an operation works.
     *
     * TODO: Delete or customize this sampleOp and add new operations that
     *       create the logs, assets and quantities needed by the new entry point.
     *
     *       See:
     *         - the `modules/farm_fd2/src/entrypoints/tray_seeding/lib.js`
     *           file for examples of using operation objects to create
     *           logs, assets and quantities.
     *
     *         - the documentation for the `runTransaction` function in
     *           `libraries/farmosUtil.js` for detailed information about
     *           the operation objects.
     */
    const sampleOp = {
      name: 'sampleOp',
      do: async () => {
        /*
         * Add a little delay here so to be sure the e2e tests have
         * enough time to see the "Submitting" toast.  Production
         * operations should not include this.
         */
        await new Promise((r) => setTimeout(r, 2000));

        /*
         * Create and return the asset, log or quantity for
         * this operation using the functions in farmosUtil.
         */
        return await farmosUtil.createPlantAsset(
          form.date,
          'ZUCCHINI', // Just for sampleOp because crop not in App.vue form.
          form.comment
        );
      },
      undo: async (results) => {
        await farmosUtil.deletePlantAsset(results['sampleOp'].id);
      },
    };
    // Add the operation to the ops for the transaction.
    ops.push(sampleOp);

    // Run all of the operations in ops as a transaction.
    return await farmosUtil.runTransaction(ops);
  } catch (error) {
    console.error('example_entry_point lib.js:');
    console.error(error);

    let errorMsg = 'Error creating Example Entry Point records.';

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

export const lib = {
  submitForm,
};
