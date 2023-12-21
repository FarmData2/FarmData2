describe('Check that the tray_seeding entry point in farm_fd2 exists.', () => {
  it('Check that admin can access tray seeding form', () => {
    // Login if running in live farmOS.
    cy.login('admin', 'admin');
    // Go to the main page.
    cy.visit('fd2/tray_seeding/');
    // Check that the page loads.
    cy.waitForPage();
  });

  it('Check that guest cannot access tray seeding form', () => {
    /*
     * Skip this test if we are not running from the live farmOS
     * server.  If we are running on the dev or preview server then
     * the login does nothing and the test would fail because the page
     * would be served to the guest.  When running on the live farmOS
     * the login validates the guest credentials and enforces the permissions
     * set for the entry point.
     *
     * For some reason the test is marked as "pending" when it is skipped
     * in this way.  None the less, Cypress reports that all tests pass
     * both on the live server and on the dev server.
     */
    cy.skipOn('localhost');

    cy.login('guest', 'farmdata2');
    cy.visit({ url: 'fd2/tray_seeding/', failOnStatusCode: false });
    cy.get('.page-title').should('contain.text', 'Access denied');
  });
});
