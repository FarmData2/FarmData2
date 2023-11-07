//import DateSelect from '@comps/DateSelector/DateSelector.vue';

describe('Test the  DateSelector component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Currently no behavior to test', () => {});
});
