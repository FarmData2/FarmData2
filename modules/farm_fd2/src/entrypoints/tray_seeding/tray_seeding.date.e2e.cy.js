import dayjs from 'dayjs';

describe('Tray Seeding: Date Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/tray_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Date exists, is visible, is enabled', () => {
    cy.get('[data-cy="tray-seeding-date"]').should('exist');
    cy.get('[data-cy="date-input"]').should('be.visible').should('be.enabled');
  });

  it('Date props are correct', () => {
    cy.get('[data-cy="date-required"]').should('be.visible');
    cy.get('[data-cy="date-label"]').should('have.text', 'Date:');
    cy.get('[data-cy="date-input"]').should(
      'have.value',
      dayjs().format('YYYY-MM-DD')
    );
  });

  it('Date validity styling works', () => {
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="date-input"]').should('have.class', 'is-valid');
  });
});
