import MultiCropSelector from '@comps/MultiCropSelector/MultiCropSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the MultiCropSelector component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check selected prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
        selected: ['BROCCOLI'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="crop-selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'BROCCOLI');
        })
        .then(() => {
          /*
           * Without extra then here, the wrapper.setProps usually executes before
           * the cy.get() above, causing the test to fail.
           */
          wrapper.setProps({ selected: ['BROCCOLI', 'ARUGULA'] });
          cy.get('[data-cy="crop-selector-1"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'BROCCOLI');
          cy.get('[data-cy="crop-selector-2"]')
            .find('[data-cy="selector-input"]')
            .should('have.value', 'ARUGULA');
        });
    });
  });

  it('Making selections adds another selector', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-selector-2"]').should('not.exist');
        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');
        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');

        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-input"]')
          .select('BROCCOLI');

        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-add-button"]')
          .should('not.exist');
        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .should('exist');

        cy.get('[data-cy="crop-selector-2"]').should('exist');
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-add-button"]')
          .should('exist');
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .should('not.exist');
      });
  });

  it('Delete button can remove first selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
        selected: ['BROCCOLI', 'ARUGULA', 'BEAN'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'BROCCOLI');
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'ARUGULA');
        cy.get('[data-cy="crop-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'BEAN');
        cy.get('[data-cy="crop-selector-4"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);

        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'ARUGULA');
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'BEAN');
        cy.get('[data-cy="crop-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="crop-selector-4"]').should('not.exist');
      });
  });

  it('Delete button can remove last selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
        selected: ['BROCCOLI', 'ARUGULA', 'BEAN'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-selector-3"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'BROCCOLI');
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'ARUGULA');
        cy.get('[data-cy="crop-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="crop-selector-4"]').should('not.exist');
      });
  });

  it('Delete button can remove a middle selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
        selected: ['BROCCOLI', 'ARUGULA', 'BEAN'],
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-delete-button"]')
          .click();

        cy.get('[data-cy="crop-selector-1"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'BROCCOLI');
        cy.get('[data-cy="crop-selector-2"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', 'BEAN');
        cy.get('[data-cy="crop-selector-3"]')
          .find('[data-cy="selector-input"]')
          .should('have.value', null);
        cy.get('[data-cy="crop-selector-4"]').should('not.exist');
      });
  });

  it('Navigates to the add crop form and clears the crop cache on add button click', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept('GET', '**/taxonomy/manage/plant_type/add', {
      statusCode: 200,
      body: 'Add Crop Form',
    }).as('urlIntercept');

    cy.mount(MultiCropSelector, {
      props: {
        onReady: readySpy,
      },
    }).then(() => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          expect(farmosUtil.getFromGlobalVariableCache('crops')).to.not.be.null;
          cy.get('[data-cy="selector-add-button"]').should('exist');
          cy.get('[data-cy="selector-add-button"]').click();
          cy.wait('@urlIntercept')
            .its('response.statusCode')
            .should('eq', 200)
            .then(() => {
              expect(farmosUtil.getFromGlobalVariableCache('crops')).to.be.null;
            });
        });
    });
  });
});
