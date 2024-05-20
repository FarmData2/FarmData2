// eslint-disable-next-line no-unused-vars
import * as lib from './lib';

describe('Test the %ENTRY_POINT_TITLE% lib submission error', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the entry point.  This will be passed
   * to the lib functions as if it is coming from the
   * entry point as a submission.
   */
  // eslint-disable-next-line no-unused-vars
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
       * TODO: Create a test that checks that if a submission error occurs
       * that all of the records created prior to the error have been deleted.
       *
       * See modules/farm_fd2/src/entrypoints/tray_seeding/lib.submitError.unit.cy.js
       * for an example.
       */
    }
  );
});
