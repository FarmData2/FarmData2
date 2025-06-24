describe('FarmData2 Main Page - Launch Pad', () => {
  // Define the structure of categories and buttons for easier testing
  const categories = [
    {
      name: 'Seeding',
      dataCy: 'seeding-card',
      buttons: [
        {
          text: 'Cover Crop',
          dataCyText: 'cover-crop-seeding-text',
          dataCyButton: 'cover-crop-seeding-button',
          dataCyIcon: 'cover-crop-seeding-icon',
          altText: 'Cover Crop Seeding',
          path: '/fd2/cover_crop_seeding',
        },
        {
          text: 'Direct',
          dataCyText: 'direct-seeding-text',
          dataCyButton: 'direct-seeding-button',
          dataCyIcon: 'direct-seeding-icon',
          altText: 'Direct Seeding',
          path: '/fd2/direct_seeding',
        },
        {
          text: 'Tray',
          dataCyText: 'tray-seeding-text',
          dataCyButton: 'tray-seeding-button',
          dataCyIcon: 'tray-seeding-icon',
          altText: 'Tray Seeding',
          path: '/fd2/tray_seeding',
        },
      ],
    },
    {
      name: 'Soil',
      dataCy: 'soil-card',
      buttons: [
        {
          text: 'Disturbance',
          dataCyText: 'soil-disturbance-text',
          dataCyButton: 'soil-disturbance-button',
          dataCyIcon: 'soil-disturbance-icon',
          altText: 'Soil Disturbance',
          path: '/fd2/soil_disturbance',
        },
      ],
    },
    {
      name: 'Others',
      dataCy: 'others-card',
      buttons: [
        {
          text: 'Transplanting',
          dataCyText: 'transplanting-text',
          dataCyButton: 'transplanting-button',
          dataCyIcon: 'transplanting-icon',
          altText: 'Transplanting',
          path: '/fd2/transplanting',
        },
      ],
    },
  ];

  beforeEach(() => {
    cy.login('admin', 'admin'); // Login before each test
    cy.visit('/fd2/main/');
    cy.waitForPage();
  });

  it('should display the correct page title', () => {
    cy.get('[data-cy="launchpad-title"]')
      .should('be.visible')
      .and('contain.text', 'FarmData2');
  });

  it('should display category cards with correct titles and their respective buttons with text and icons', () => {
    cy.get('[data-cy="launchpad-categories-container"]').should('be.visible');

    categories.forEach((category) => {
      // Check category card visibility and title
      cy.get(`[data-cy="${category.dataCy}"]`).as('currentCard');
      cy.get('@currentCard').should('be.visible');
      // BCard renders header text within a div with class 'card-header' inside the BCard component
      cy.get('@currentCard')
        .find('.card-header')
        .should('contain.text', category.name);

      // Check buttons within the category card
      category.buttons.forEach((button) => {
        // Scope subsequent find commands to the current card
        cy.get('@currentCard').within(() => {
          cy.get(`[data-cy="${button.dataCyButton}"]`).as('currentButton');
          cy.get('@currentButton').should('be.visible');

          // Check button text using its specific data-cy attribute
          cy.get(`[data-cy="${button.dataCyText}"]`)
            .should('be.visible')
            .and('contain.text', button.text);

          // Check icon within the button
          cy.get(`[data-cy="${button.dataCyIcon}"]`)
            .should('be.visible')
            .and('have.attr', 'alt', button.altText);
        });
      });
    });
  });

  // Navigation Tests
  categories.forEach((category) => {
    category.buttons.forEach((button) => {
      it(`should navigate to the "${button.altText}" page when the "${button.text}" button is clicked`, () => {
        // Click the button using its data-cy attribute.
        // It's better to click the button itself, not just the text span,
        // if the click handler is on the button.
        cy.get(`[data-cy="${button.dataCyButton}"]`).click();

        // Assert that the URL includes the expected path
        cy.url().should('include', button.path);
      });
    });
  });
});
