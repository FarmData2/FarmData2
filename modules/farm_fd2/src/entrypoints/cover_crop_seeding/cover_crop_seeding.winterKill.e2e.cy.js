import dayjs from 'dayjs';

describe('Cover Crop Seeding: WinterKill Component', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/cover_crop_seeding/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('WinterKill exists, is visible, is enabled', () => {
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]').should('exist');
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .should('be.visible')
      .should('be.enabled');
  });

  it('WinterKill props are correct', () => {
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .click();

    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-required"]')
      .should('be.visible');

    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .should(
        'have.value',
        dayjs(new Date(new Date().getFullYear() + 1, 0, 1)).format('YYYY-MM-DD')
      );
  });

  it('WinterKill validity styling works with valid date', () => {
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .click();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .should('have.class', 'is-valid');
  });

  it('WinterKill validity styling works with invalid date', () => {
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .click();

    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .clear();

    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .should('have.class', 'is-invalid');
  });

  it('Date input disappears when winterkill checkbox is unchecked', () => {
    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .click();

    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .should('exist');

    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-checkbox"]')
      .click();

    cy.get('[data-cy="cover-crop-seeding-winter-kill"]')
      .find('[data-cy="winter-kill-date-input"]')
      .should('not.exist');
  });
});
