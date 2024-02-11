import LocationSelector from '@comps/LocationSelector/LocationSelector.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the LocationSelector component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('"valid" event is propagated on creation', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('"valid" event works when bed selection disabled', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        allowBedSelection: false,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);
      });
  });

  it('"valid" event works when location selection changes validity', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        required: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="selector-input"]').select('CHUAU');

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('"valid" event works when bed selection changes validity', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        required: true,
        allowBedSelection: true,
        requireBedSelection: true,
        onReady: readySpy,
        onValid: validSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        cy.get('[data-cy="selector-input"]').select('CHUAU');

        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', false);

        // Pick CHUAU-1
        cy.get('[data-cy="picker-options"]').find('input').eq(0).check();

        cy.get('@validSpy').should('have.been.calledTwice');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('"update:selection" event is propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        'onUpdate:selected': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'CHUAU');
      });
  });

  it('"update:beds" event is propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onReady: readySpy,
        'onUpdate:beds': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('CHUAU');
        cy.get('@updateSpy').should('not.have.been.called');

        // Pick CHUAU-1
        cy.get('[data-cy="picker-options"]').find('input').eq(0).check();

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', ['CHUAU-1'], 5);
      });
  });

  it('Selected beds are cleared when location is changed', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        selected: 'CHUAU',
        pickedBeds: ['CHUAU-1', 'CHUAU-3'],
        onReady: readySpy,
        'onUpdate:beds': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').select('GHANA');

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', [], 4);

        cy.get('[data-cy="selector-input"]').select('CHUAU');

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', [], 5);
      });
  });

  it('"error" event is emitted when fetching fields (or beds) fails', () => {
    farmosUtil.clearCachedFields();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/land?*', {
      forceNetworkError: true,
    });

    cy.mount(LocationSelector, {
      props: {
        includeFields: true,
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should('have.been.calledWith', 'Unable to fetch locations.');
    });
  });

  it('"error" event is emitted when fetching greenhouses fails', () => {
    farmosUtil.clearCachedGreenhouses();

    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/structure?*', {
      forceNetworkError: true,
    });

    cy.mount(LocationSelector, {
      props: {
        includeGreenhouses: true,
        onError: errorSpy,
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should('have.been.calledWith', 'Unable to fetch locations.');
    });
  });
});
