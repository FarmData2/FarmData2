/*
 * Utility functions for getting and working with transaction.
 */

/**
 * Execute a series of log, asset, or quantity creation operations as a transaction.
 * If one of the operations fails, then an attempt will be made to undo all of the completed operations.
 *
 * @param {Array<Object>} operations the operations to execute as a transaction.
 * Each operation must have the following structure:
 *
 * ```
 * {
 * name: string,
 * do: (Object) => async function performs an action and returns a result (e.g. creates a log, asset or quantity.) The argument has the same format as the return value. It contains the result of all prior operations, allowing them to be used by future operations.
 * undo: (Object) => async function that undoes the action performed by `do` (e.g. deletes a log, asset or quantity). The argument has the same format as the return value and contains the result of all successfully completed operations.
 * }
 * ```
 *
 * @return {Object} an object with an attribute for each operation.
 * The attribute name is the operation name and its value is the result of the operation (i.e. the value returned from the `do` function).
 *
 * @throws {Error} if unable to execute the `do` function one of the operations or if unable to execute the `undo` of all operations in the transaction.
 * The `cause` of the error will include a `results` attribute with the same format as the returned object.
 * If an operation was completed and has been undone the attribute for that operation will have the value `undone`.
 * If an operation was completed but has not been undone the attribute for that operation will be the result of the operation.
 * If an operation was attempted but failed (and thus was not undone) the attribute for that operation will be `null`.
 * If an operation was never attempted (and thus also not undone) the attribute for that operation will be `undefined`.
 *
 * @category Utilities
 *  *
 * @example
 * // Create a transaction with a plant asset, a quantity, and a log
 * let operations = [];
 *
 * const createPlantAsset = {
 *   name: 'plantAsset',
 *   do: async () => {
 *     return await farmosUtil.createPlantAsset(
 *       '2023-10-01', // Example date
 *       'ZUCCHINI',   // Example crop name
 *       'Planting zucchini in the greenhouse' // Example comment
 *     );
 *   },
 *   undo: async (results) => {
 *     await farmosUtil.deletePlantAsset(results['createPlantAsset'].id);
 *   },
 * }
 * operations.push(createPlantAsset);
 *
 * const createQuantity = {
 *   name: 'plantedQuantity',
 *   do: async () => {
 *     return await farmosUtil.createStandardQuantity(
 *       'count',
 *        50,
 *       'Row Feet',
 *       'FEET'
 *        results.plantAsset,
 *       'increment'
 *     );
 *   },
 *   undo: async (results) => {
 *     if (results['seedingLog'] !== 'undone') {
 *        await farmosUtil.deleteStandardQuantity(results['plantedQuantity'].id);
 *     }
 *   }
 * }
 * operations.push(createQuantity);
 *
 * const createLog = {
 *   name: 'seedingLog',
 *   do: async (results) => {
 *     return await farmosUtil.createSeedingLog(
 *       '2023-10-01',
 *       'CHUAU',
 *       [],
 *       ['seeding'],
 *       results.plantAsset,
 *       [results.plantedQuantity]
 *     );
 *   },
 *   undo: async (results) => {
 *     await farmosUtil.deleteSeedingLog(results['createLog'].id);
 *   },
 * }
 * operations.push(createLog);
 *
 * runTransaction(operations)
 *   .then((results) => console.log('Transaction completed successfully:', results))
 *   .catch((error) => console.error('Transaction failed:', error));
 */
export async function runTransaction(operations) {
  const done = {};
  const undo = [];

  try {
    for (const operation of operations) {
      done[operation.name] = null;
      const result = await operation.do(done);
      done[operation.name] = result;
      undo.push(operation);
    }
  } catch (error) {
    console.error('runTransaction: Error running transaction.');
    console.error(' Attempting to undo completed operations.');
    for (const operation of undo.reverse()) {
      try {
        await operation.undo(done);
        done[operation.name] = 'undone';
        console.error('  ' + operation.name + ' undone.');
      } catch (error) {
        console.error('  failed to undo ' + operation.name);

        if (
          done[operation.name].id &&
          done[operation.name].attributes &&
          done[operation.name].attributes.name
        ) {
          console.error('   uuid: ' + done[operation.name].id);
          console.error('   name: ' + done[operation.name].attributes.name);
        }
      }
    }
    console.error(' Done.');

    const errorObj = new Error('Error running transaction.');
    errorObj.cause = error;
    errorObj.results = done;

    throw errorObj;
  }

  return done;
}
