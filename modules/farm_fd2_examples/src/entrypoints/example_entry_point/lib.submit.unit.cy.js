import * as lib from './lib';
// eslint-disable-next-line no-unused-vars
import * as farmosUtil from '@libs/farmosUtil/farmosUtil';

describe('Test the example_entry_point lib submission', () => {
  /*
   * Create a form object that has the same format as the data.form
   * object used in the entry point.  This will be passed
   * to the lib functions as if it is coming from the
   * entry point as a submission.
   */
  let form = {
    date: '1950-01-02',
    comment: 'A comment',
  };

  let result = null;
  before(() => {
    /*
     * Use the lib to submit the form defined above.  This will happen
     * once when this test file is run, creating the entry point's
     * logs, assets and quantities in farmOS. Individual tests below
     * then check each log, asset and quantity to ensure that they have
     * been created correctly.
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
   * There should be one test for each log, asset and quantity.
   * Each test will fetch the the log, asset or quantity that it
   * is testing from farmOS and compare it to the expected result.
   *
   * See modules/farm_fd2/src/entrypoints/tray_seeding/lib.js for
   * an example of how to test the logs, assets and quantities.
   */

  /*
   * This test is a place holder and should be removed
   * and replaced with actual tests when the submitForm
   * function is being written and tested.
   */
  it('Placeholder that just checks the sampleOp result', () => {
    expect(result.sampleOp.date).to.equal('1950-01-02');
    expect(result.sampleOp.comment).to.equal('A comment');
  });
});
