import DateSelector from '@comps/DateSelector/DateSelector.vue';
import dayjs from 'dayjs';

describe('Test the default DateSelector content', () => {
  it('Check all of the data-cy elements', () => {
    cy.mount(DateSelector);

    cy.get('[data-cy="date-group"]').should('exist');
    cy.get('[data-cy="date-label"]').should('have.text', 'Date:');
    cy.get('[data-cy="required-star"]').should('not.exist');
    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
    cy.get('[data-cy="date-help"]').should('have.text', 'Select date.');
  });

  it('Test that required indicator can be shown', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
      },
    });
    cy.get('[data-cy="required-star"]').should('exist');
    cy.get('[data-cy="required-star"]').should('have.text', '*');
  });

  it('Test that help text is shown', () => {
    cy.mount(DateSelector, {
      props: {
        helpText: 'Testing help text.',
      },
    });
    cy.get('[data-cy="date-help"]').should('have.text', 'Testing help text.');
  });

  it('Test that the date can be set', () => {
    cy.mount(DateSelector, {
      props: {
        date: '1999-01-02',
      },
    });

    cy.get('[data-cy="date-input"]').should('have.value', '1999-01-02');
  });
});
