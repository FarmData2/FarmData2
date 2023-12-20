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

  it('Check all of the data-cy elements and default props', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-group"]').should('exist');
        cy.get('[data-cy="date-label"]').should('have.text', 'Date:');
        cy.get('[data-cy="date-required"]').should('not.exist');
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
  });

  it('Test that props are passed', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(DateSelector, {
      props: {
        required: true,
        date: '1999-01-02',
        showValidityStyling: true,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="date-required"]').should('exist');
        cy.get('[data-cy="date-required"]').should('have.text', '*');
        cy.get('[data-cy="date-input"]').should('have.value', '1999-01-02');
        cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
      });
  });
});
