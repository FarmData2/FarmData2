import DateSelector from '@comps/DateSelector/DateSelector.vue';
import dayjs from 'dayjs';

describe('Test the default DateSelector content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the data-cy elements', () => {
    cy.mount(DateSelector);

    cy.get('[data-cy="date-group"]').should('exist');
    cy.get('[data-cy="date-label"]').should('have.text', 'Date:');
    cy.get('[data-cy="required-star"]').should('not.exist');
    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
    cy.get('[data-cy="date-valid-text"]').should('be.visible');
    cy.get('[data-cy="date-valid-text"]').should('have.text', 'Select date.');
    cy.get('[data-cy="date-invalid-text"]').should('not.be.visible');
    cy.get('[data-cy="date-invalid-text"]').should(
      'have.text',
      'Date selection is required.'
    );
  });

  it('Test defaults when DateSelector is required.', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
      },
    });

    cy.get('[data-cy="required-star"]').should('exist');
    cy.get('[data-cy="required-star"]').should('have.text', '*');
    cy.get('[data-cy="date-valid-text"]').should('be.visible');
    cy.get('[data-cy="date-invalid-text"]').should('not.be.visible');
  });

  it('Test props for validText and invalidText', () => {
    cy.mount(DateSelector, {
      props: {
        validText: 'The valid text.',
        invalidText: 'The invalid text.',
      },
    });

    cy.get('[data-cy="date-valid-text"]').should(
      'have.text',
      'The valid text.'
    );
    cy.get('[data-cy="date-invalid-text"]').should(
      'have.text',
      'The invalid text.'
    );
  });

  it('Test the date prop', () => {
    cy.mount(DateSelector, {
      props: {
        date: '1999-01-02',
      },
    });

    cy.get('[data-cy="date-input"]').should('have.value', '1999-01-02');
  });

  it('Test valid with date set to null', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: null,
      },
    });

    cy.get('[data-cy="date-valid-text"]').should('not.be.visible');
    cy.get('[data-cy="date-invalid-text"]').should('be.visible');
  });

  it('Test valid with date set to empty string', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '',
      },
    });

    cy.get('[data-cy="date-valid-text"]').should('not.be.visible');
    cy.get('[data-cy="date-invalid-text"]').should('be.visible');
  });

  it('Test valid with date set to an invalid date', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: 'invalid-date',
      },
    });

    cy.get('[data-cy="date-valid-text"]').should('not.be.visible');
    cy.get('[data-cy="date-invalid-text"]').should('be.visible');
  });
});
