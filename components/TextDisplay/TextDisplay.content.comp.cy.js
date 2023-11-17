import TextDisplay from '@comps/TextDisplay/TextDisplay.vue';

describe('Test the default TextDisplay content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check all of the default data-cy elements', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TextDisplay, {
      props: {
        label: 'Test Label',
        text: 'Test Text',
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="text-label"]').should('have.text', 'Test Label:');
        cy.get('[data-cy="text-text"]').should('have.value', 'Test Text');
      });
  });

  it('Check null text renders as empty string', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TextDisplay, {
      props: {
        label: 'Test Label',
        text: null,
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="text-label"]').should('have.text', 'Test Label:');
        cy.get('[data-cy="text-text"]').should('have.value', '');
      });
  });
});
