import SelectorBase from '@comps/SelectorBase/SelectorBase.vue';

describe('Test the SelectorBase behaviors', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check options property updates when the array reference changes', () => {
    const initOpts = ['One', 'Two', 'Three'];
    const newOpts = ['A', 'B', 'C', 'D'];

    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: initOpts,
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-option-1"]').should('have.value', 'One');
          wrapper.setProps({ options: newOpts });
          cy.get('[data-cy="selector-option-1"]').should('have.value', 'A');
          cy.get('[data-cy="selector-option-4"]').should('have.value', 'D');
        });
    });
  });

  it('Verify that `selected` prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          wrapper.setProps({ selected: 'Two' });
          cy.get('[data-cy="selector-input"]').should('have.value', 'Two');
        });
    });
  });

  it('showValidity prop is reactive', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        showValidStyling: false,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-valid'
          );
          cy.get('[data-cy="selector-input"]').should(
            'not.have.class',
            'is-invalid'
          );

          wrapper.setProps({ showValidityStyling: true });

          cy.get('[data-cy="selector-input"]').should(
            'have.class',
            'is-invalid'
          );
        });
    });
  });

  it('Delete clears selection', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(SelectorBase, {
      props: {
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        selected: 'Two',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-input"]').should('have.value', 'Two');
        cy.get('[data-cy="selector-delete-button"]').click();
        cy.get('[data-cy="selector-input"]').should('have.value', null);
      });
  });

  it('Clicking add button goes to the addUrl', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.intercept(
      { method: 'GET', url: 'http://farmos', times: 1 },
      {
        statusCode: 200,
        body: 'Add Option Form',
      }
    ).as('urlIntercept');

    cy.mount(SelectorBase, {
      props: {
        required: true,
        invalidFeedbackText: 'Invalid feedback text.',
        label: `TheLabel`,
        options: ['One', 'Two', 'Three', 'Four', 'Five'],
        onReady: readySpy,
        addOptionUrl: 'http://farmos',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="selector-add-button"]').should('exist');
        cy.get('[data-cy="selector-add-button"]').click();
        cy.wait('@urlIntercept').its('response.statusCode').should('eq', 200);
      });
  });
});
