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
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
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
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
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
   * required    validDate    show styling  Test
   * false       false        false             1. Not required, invalid date, no styling
   * false       false        true              2. Not required, invalid date, showing styling
   * false       true         false             3. Not required, valid date, not showing styling
   * false       true         true              4. Not required,  valid date, showing styling
   * true        false        false             5. Required, invalid valid date, not showing styling
   * true        false        true              6. Required, invalid valid date, showing styling
   * true        true         false             7. Required, valid date, not showing styling
   * true        true         true              8. Required, valid date, showing styling
   */

  it('1. Not required, invalid date, no styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: false,
        date: null,
        showValidityStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('2. Not required, invalid date, showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: false,
        date: null,
        showValidityStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('3. Not required, valid date, not showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: false,
        date: '1999-01-02',
        showValidityStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('4. Not required,  valid date, showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: false,
        date: '1999-01-02',
        showValidityStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('5. Required, invalid valid date, not showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: null,
        showValidityStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('6. Required, invalid valid date, showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: null,
        showValidityStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('be.visible');
  });

  it('7. Required, valid date, not showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '1999-01-02',
        showValidityStyling: false,
      },
    });

    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });

  it('8. Required, valid date, showing styling', () => {
    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '1999-01-02',
        showValidityStyling: true,
      },
    });

    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
    cy.get('[data-cy="date-input"]').should('not.have.class', 'is-invalid');
    cy.get('[data-cy="date-invalid-feedback"]').should('not.be.visible');
  });
});
