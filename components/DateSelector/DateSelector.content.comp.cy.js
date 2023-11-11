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
    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
    cy.get('[data-cy="date-invalid-feedback"]').should(
      'contain.text',
      'A valid date is required.'
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
    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('Test the date prop', () => {
    cy.mount(DateSelector, {
      props: {
        date: '1999-01-02',
      },
    });

    cy.get('[data-cy="date-input"]').should('have.value', '1999-01-02');
  });

  /*
   *There are 8 possibilities here...
   *
   * required    validDate    showValidStyling  Test
   * false       false        false             Not required with valid date not showing invalid styling
   * false       false        true              Not required with invalid date showing invalid styling
   * false       true         false             Check all of the data-cy elements. (above)
   * false       true         true              Not required with valid date not showing invalid styling
   * true        false        false             Required with invalid valid date not showing invalid styling
   * true        false        true              Required with invalid valid date not showing invalid styling
   * true        true         false             Test defaults when DateSelector is required. (above)
   * true        true         true              Required with valid date showing invalid styling
   */

  it('Not required with invalid date not showing invalid styling', () => {
    cy.mount(DateSelector, {
      props: {
        requried: false,
        date: '1999-01-02',
        showInvalidStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('Not required with invalid date showing invalid styling', () => {
    cy.mount(DateSelector, {
      props: {
        reqiured: false,
        date: 'invalid-date',
        showInvalidStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('Not required with valid date not showing invalid styling', () => {
    cy.mount(DateSelector, {
      props: {
        requried: false,
        date: '1999-01-02',
        showInvalidStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('Required with invalid valid date not showing invalid styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: 'invalid-date',
        showInvalidStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('Required with invalid valid date not showing invalid styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: 'invalid-date',
        showInvalidStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('Required with valid date showing invalid styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '1999-01-02',
        showInvalidStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });
});
