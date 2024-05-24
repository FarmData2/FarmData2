import { lib } from './lib';

describe('Test the %ENTRY_POINT_TITLE% lib submission error', () => {
  /*
   * TODO: Create a form object that has the same format as the
   *       data.form object used in the entry point.
   *
   *       This will be passed to the lib functions as if it is
   *       coming from the entry point as a submission.
   */
  let form = {
    seedingDate: '1950-01-02',
    comment: 'A comment',
  };

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it(
    '%ENTRY_POINT_TITLE%: records are deleted if there is a submission error',
    { retries: 4 },
    () => {
      /*
       * TODO: Modify the API path to create a error on submission of the
       *       last asset, log or quantity that is created by %ENTRY_POINT%/lib.js.
       *       At that point all other records should have been created and thus
       *       should also all be deleted by their operation's `undo` function.
       *
       *       For examples, see the lib.submitError.unit.cy.js files in:
       *         - modules/farm_fd2/src/entrypoints/tray_seeding
       *         - modules/farm_fd2/src/entrypoints/direct_seeding
       */
      cy.intercept('GET', '**/api/log/*', {
        statusCode: 401,
      });

      /*
       * TODO: Create an intercept with a spy for each of the endpoints
       *       where records are being deleted.  We'll then check that each was
       *       called the appropriate number of times.  This doesn't actually check
       *       the database, but it gives reasonably high confidence that everything
       *       worked.
       *
       *       For examples, see the lib.submitError.unit.cy.js files in:
       *         - modules/farm_fd2/src/entrypoints/tray_seeding
       *         - modules/farm_fd2/src/entrypoints/direct_seeding
       */
      cy.wrap(
        lib
          .submitForm(form)
          .then(() => {
            // Shouldn't run because submitForm throws an error.
            throw new Error('The submission should have failed.');
          })
          .catch((error) => {
            expect(error.message).to.contain(
              'Error creating %ENTRY_POINT_TITLE% records.'
            );

            /*
             * TODO: Add checks for each of the intercept spies to check
             *       that the correct number of logs, assets, and quantities
             *       were deleted.
             *
             *       For examples, see the lib.submitError.unit.cy.js files in:
             *         - modules/farm_fd2/src/entrypoints/tray_seeding
             *         - modules/farm_fd2/src/entrypoints/direct_seeding
             */
          }),
        { timeout: 10000 }
      );
    }
  );
});
