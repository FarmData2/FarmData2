describe('Direct Seeding: Termination event group', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();

    cy.login('admin', 'admin');
    cy.visit('fd2/soil_disturbance/');
    cy.waitForPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Termination group does not exist initially', () => {
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
  });

  it('Selecting location with plants shows termination checkbox and picklist table but no bed picker', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-picklist"]').should('exist');
    cy.get('[data-cy="picklist-all-button"]').should('exist');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('exist');
    });
    cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
      cy.wrap($el).should('exist');
    });

    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('be.visible');
    cy.get('[data-cy="picklist-all-button"]').should('be.visible');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.visible');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.visible');
    cy.get('[data-cy="picklist-checkbox-2"]').should('be.visible');

    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
    cy.get('[data-cy="picklist-all-button"]').should('be.enabled');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('be.enabled');
    });
    cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
      cy.wrap($el).should('be.enabled');
    });
  });

  it('Selecting location with plants shows no bed column', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="termination-event-picklist"]')
      .should('exist')
      .should('be.visible');
    cy.get('[data-cy="picklist-header-bed"]').should('not.exist');
  });

  it('Selecting location with no plants shows no termination checkbox and table but shows the bed picker', () => {
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
    cy.get('[data-cy="termination-event-picklist"]').should('not.exist');
    cy.get('[data-cy="picklist-all-button"]').should('not.exist');
    cy.get('[data-cy="sort-order-button"]').should('not.exist');
    cy.get('[data-cy^="picklist-checkbox-"]').should('not.exist');

    cy.get('[data-cy="location-beds-accordion"]').should('exist');
    cy.get('[data-cy="picker-options"]').should('exist');
    cy.get('[data-cy="picker-all-button"]').should('exist');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('exist');
      });

    cy.get('[data-cy="picker-options"]').should('be.visible');
    cy.get('[data-cy="picker-options"]').should('be.visible');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.visible');
      });

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.enabled');
      });

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.checked');
      });
  });

  it('Switching locations shows/hides bed column in termination table', () => {
    //bed column
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="termination-event-picklist"]')
      .should('exist')
      .should('be.visible');
    cy.get('[data-cy="picklist-header-bed"]')
      .should('exist')
      .should('be.visible');

    // no bed column
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="termination-event-picklist"]')
      .should('exist')
      .should('be.visible');
    cy.get('[data-cy="picklist-header-bed"]').should('not.exist');

    //bed column
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('CHUAU');
    cy.get('[data-cy="termination-event-picklist"]')
      .should('exist')
      .should('be.visible');
    cy.get('[data-cy="picklist-header-bed"]')
      .should('exist')
      .should('be.visible');

    // no bed column
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('C');
    cy.get('[data-cy="termination-event-picklist"]')
      .should('exist')
      .should('be.visible');
    cy.get('[data-cy="picklist-header-bed"]').should('not.exist');
  });

  it('Switching locations shows/hides termination group', () => {
    //valid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('ALF');
    cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-picklist"]').should('exist');
    cy.get('[data-cy="picklist-all-button"]').should('exist');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('exist');
    });
    cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
      cy.wrap($el).should('exist');
    });

    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('be.visible');
    cy.get('[data-cy="picklist-all-button"]').should('be.visible');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.visible');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.visible');
    cy.get('[data-cy="picklist-checkbox-2"]').should('be.visible');

    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
    cy.get('[data-cy="picklist-all-button"]').should('be.enabled');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('be.enabled');
    });
    cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
      cy.wrap($el).should('be.enabled');
    });

    //invalid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
    cy.get('[data-cy="termination-event-picklist"]').should('not.exist');
    cy.get('[data-cy="picklist-all-button"]').should('not.exist');
    cy.get('[data-cy="sort-order-button"]').should('not.exist');
    cy.get('[data-cy^="picklist-checkbox-"]').should('not.exist');

    cy.get('[data-cy="location-beds-accordion"]').should('exist');
    cy.get('[data-cy="picker-options"]').should('exist');
    cy.get('[data-cy="picker-all-button"]').should('exist');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('exist');
      });

    cy.get('[data-cy="picker-options"]').should('be.visible');
    cy.get('[data-cy="picker-options"]').should('be.visible');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.visible');
      });

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.enabled');
      });

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.checked');
      });

    //valid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('A');
    cy.get('[data-cy="location-beds-accordion"]').should('not.exist');
    cy.get('[data-cy="termination-event-group"]').should('exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('exist');
    cy.get('[data-cy="termination-event-label"]').should('exist');
    cy.get('[data-cy="termination-event-picklist"]').should('exist');
    cy.get('[data-cy="picklist-all-button"]').should('exist');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('exist');
    });
    cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
      cy.wrap($el).should('exist');
    });

    cy.get('[data-cy="termination-event-group"]').should('be.visible');
    cy.get('[data-cy="termination-event-checkbox"]').should('be.visible');
    cy.get('[data-cy="termination-event-label"]').should('be.visible');
    cy.get('[data-cy="termination-event-picklist"]').should('be.visible');
    cy.get('[data-cy="picklist-all-button"]').should('be.visible');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('be.visible');
    });
    cy.get('[data-cy="picklist-checkbox-0"]').should('be.visible');
    cy.get('[data-cy="picklist-checkbox-1"]').should('be.visible');
    cy.get('[data-cy="picklist-checkbox-2"]').should('be.visible');

    cy.get('[data-cy="termination-event-checkbox"]').should('be.enabled');
    cy.get('[data-cy="picklist-all-button"]').should('be.enabled');
    cy.get('[data-cy="sort-order-button"]').each(($el) => {
      cy.wrap($el).should('be.enabled');
    });
    cy.get('[data-cy^="picklist-checkbox-"]').each(($el) => {
      cy.wrap($el).should('be.enabled');
    });

    //invalid
    cy.get('[data-cy="soil-disturbance-location"]')
      .find('[data-cy="selector-input"]')
      .select('H');
    cy.get('[data-cy="termination-event-group"]').should('not.exist');
    cy.get('[data-cy="termination-event-checkbox"]').should('not.exist');
    cy.get('[data-cy="termination-event-label"]').should('not.exist');
    cy.get('[data-cy="termination-event-picklist"]').should('not.exist');
    cy.get('[data-cy="picklist-all-button"]').should('not.exist');
    cy.get('[data-cy="sort-order-button"]').should('not.exist');
    cy.get('[data-cy^="picklist-checkbox-"]').should('not.exist');

    cy.get('[data-cy="location-beds-accordion"]').should('exist');
    cy.get('[data-cy="picker-options"]').should('exist');
    cy.get('[data-cy="picker-all-button"]').should('exist');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('exist');
      });

    cy.get('[data-cy="picker-options"]').should('be.visible');
    cy.get('[data-cy="picker-options"]').should('be.visible');
    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.visible');
      });

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.enabled');
      });

    cy.get('[data-cy="picker-options"]')
      .find('input')
      .each(($el) => {
        cy.wrap($el).should('be.checked');
      });
  });
});
