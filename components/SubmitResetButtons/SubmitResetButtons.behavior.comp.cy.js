//import SubmitResetButtons from '@comps/SubmitResetButtons/SubmitResetButtons.vue';

describe('Test the  DateSelect component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('No behavior to test currently', () => {});
});
