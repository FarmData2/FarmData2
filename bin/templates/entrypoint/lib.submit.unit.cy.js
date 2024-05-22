import * as lib from './lib';
// TODO: Delete this comment and the eslint-disable on the next line.
// eslint-disable-next-line no-unused-vars
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the %ENTRY_POINT_TITLE% lib submission', () => {
  /*
   * TODO: Create a form object that has the same format as the
   *       data.form object used in the entry point.
   *
   *       This will be passed to the lib functions as if it is
   *       coming from the entry point as a submission.
   */
  let form = {
    date: '1950-01-02',
    comment: 'A comment',
  };

  let result = null;
  before(() => {
    /*
     * TODO: Load any maps or other data from the API that will be needed
     *       by the tests.
     *
     *       For examples, see the lib.submit.unit.cy.js files in:
     *         - modules/farm_fd2/src/entrypoints/tray_seeding
     *         - modules/farm_fd2/src/entrypoints/direct_seeding
     */

    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then((res) => {
      result = res;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  /*
   * TODO: Create one test for each log, asset and quantity that
   *       is created by the lib.submitForm function. Each test will
   *       fetch the the log, asset or quantity that it is testing from
   *       farmOS and compare it to the expected result.
   *
   *       Examples of lib.submit.unit.cy.js files can be found in:
   *         - modules/farm_fd2/src/entrypoints/tray_seeding
   *         - modules/farm_fd2/src/entrypoints/direct_seeding
   */

  /*
   * TODO: Delete this test. It is just a place holder that
   *       is included in the template for creating new entry
   *       points.
   */
  it('%ENTRY_POINT_TITLE%: Placeholder checks the sampleOp result', () => {
    expect(result.sampleOp.attributes.timestamp).to.contain('2019-08-29');
    expect(result.sampleOp.attributes.name).to.equal(
      '2019-08-29_ts_LETTUCE-ICEBERG'
    );
  });
});
