import dayjs from 'dayjs';

describe('Example Entry Point: Submit/Reset Buttons component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2_examples/example_entry_point/');

    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Buttons exist, are visible, and are enabled', () => {
    cy.get('[data-cy="submit-button"]')
      .should('be.visible')
      .should('be.enabled');
    cy.get('[data-cy="reset-button"]')
      .should('be.visible')
      .should('be.enabled');
  });

  function populateForm() {
    cy.get('[data-cy="date-input"]').type(dayjs().format('1999-01-02'));

    /*
     * TODO: Populate additional elements of the form with valid values.
     */

    cy.get('[data-cy="comment-input"]').type('This is a comment');
    cy.get('[data-cy="comment-input"]').blur();
  }

  it('Invalid date disables submit', () => {
    populateForm();
    cy.get('[data-cy="submit-button"]').should('be.enabled');

    cy.get('[data-cy="date-input"]').clear();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="submit-button"]').should('be.disabled');

    cy.get('[data-cy="date-input"]').type('2020-01-01');
    cy.get('[data-cy="date-input"]').blur();
    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });

  /*
   * TODO: Add tests for each component that can prevent submission.
   * Each test should:
   *   - populate the form with valid values.
   *   - invalidate the element being tested.
   *   - click submit.
   *   - check that the submit button has been disabled.
   *   - make the element valid.
   *   - check that the submit button has been enabled.
   *
   * Use the "Invalid date disables submit" test above as an example.
   */

  it('Reset button resets form', () => {
    populateForm();
    cy.get('[data-cy="reset-button"]').click();

    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );

    /*
     * TODO: Add additional tests to check that all other components
     * are reset here. Note that this is not a sticky reset so all
     * components should be reset to their default values.
     */

    cy.get('[data-cy="comment-input"]').should('have.value', '');

    cy.get('[data-cy="submit-button"]').should('be.enabled');
  });
});
