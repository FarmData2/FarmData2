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
 *   sampleOp: {log--seeding},
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
        /*
         * Simulate an operation that will be caught by the intercepts
         * and spies in:
         *   - %ENTRY_POINT%.submission.e2e.cy.js
         *   - lib.submitError.unit.cy.js
         *
         * This operation fetches the first seeding log.
         * In practice, operations will add assets, logs and quantities
         * rather than fetching them.
         */
        const farm = await farmosUtil.getFarmOSInstance();
        const filter = {
          type: 'log--seeding',
          name: '2019-08-29_ts_LETTUCE-ICEBERG',
        };
        const result = await farm.log.fetch(filter);

        /*
         * Just here for this sampleOp.  In practice, ops will not
         * will not print any output to the console.
         */
        console.log(formData);
        console.log(result);

        return result;
      },
      undo: async (results) => {
        /*
         * Simulate an operation that will be caught by the spy in
         * the %ENTRY_POINT%.submission.e2e.cy.js file.
         *
         * This operation fetches the first seeding log.
         * In practice, operations will delete the asset, log
         * or quantity that was created in `do`.
         */
        const result = await farmosUtil.getSeedingLog(results.sampleOp.id);

        /*
         * Just here for this sampleOp.  In practice, ops will not
         * will not print any output to the console.
         */
        console.log(formData);
        console.log(result);

        return result;
      },
    };
    // Add the operation to the ops for the transaction.
    ops.push(sampleOp);

    // Run all of the operations in ops as a transaction.
    return await farmosUtil.runTransaction(ops);
  } catch (error) {
    console.error('%ENTRY_POINT% lib.js:');
    console.error(error);

    let errorMsg = 'Error creating %ENTRY_POINT_TITLE% records.';

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
