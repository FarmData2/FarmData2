import BedPicker from '@comps/BedPicker/BedPicker.vue';
import * as farmosUtil from '@libs/farmosUtil/farmosUtil.js';

describe('Test the BedPicker component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Test valid event propagated', () => {
    const readySpy = cy.spy().as('readySpy');
    const validSpy = cy.spy().as('validSpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        onValid: validSpy,
        location: 'ALF',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@validSpy').should('have.been.calledOnce');
        cy.get('@validSpy').should('have.been.calledWith', true);
      });
  });

  it('Test update:picked event propagated from user interaction', () => {
    const readySpy = cy.spy().as('readySpy');
    const pickedSpy = cy.spy().as('pickedSpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': pickedSpy,
        location: 'ALF',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="picker-options"]').find('input').eq(0).check();
        cy.get('@pickedSpy').should('have.been.calledOnce');
        cy.get('@pickedSpy').should('have.been.calledWith', ['ALF-1']);
      });
  });

  it('Emits update:picked when the picked prop changes', () => {
    const readySpy = cy.spy().as('readySpy');
    const pickedSpy = cy.spy().as('pickedSpy');

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        'onUpdate:picked': pickedSpy,
        location: 'ALF',
        picked: ['ALF-2'],
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('@pickedSpy').should('have.been.calledOnce');
          cy.get('@pickedSpy').should('have.been.calledWith', ['ALF-2']);

          wrapper.setProps({ picked: ['ALF-3', 'ALF-4'] });

          cy.get('@pickedSpy').should('have.been.calledTwice');
          cy.get('@pickedSpy').should('have.been.calledWith', [
            'ALF-3',
            'ALF-4',
          ]);
        });
    });
  });

  it('Error event if unable to fetch beds, fields or greenhouses', () => {
    farmosUtil.clearCachedBeds();

    const readySpy = cy.spy().as('readySpy');
    const errorSpy = cy.spy().as('errorSpy');

    cy.intercept('GET', '**/api/asset/land?*', {
      forceNetworkError: true,
    });

    cy.mount(BedPicker, {
      props: {
        onReady: readySpy,
        onError: errorSpy,
        location: 'ALF',
      },
    }).then(() => {
      cy.get('@errorSpy')
        .should('have.been.calledOnce')
        .should(
          'have.been.calledWith',
          'Unable to fetch greenhouses, fields or beds.'
        );
    });
  });
});
