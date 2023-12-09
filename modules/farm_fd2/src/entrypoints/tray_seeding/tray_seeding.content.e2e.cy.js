describe('Check the content of the Tray Seeding page.', () => {
  beforeEach(() => {
    cy.login('admin', 'admin');
    cy.visit('fd2/tray_seeding/');
    cy.waitForPage();
  });

  it('.', () => {});
});
