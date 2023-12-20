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

  it('Component reacts to changed value prop', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(TextDisplay, {
      props: {
        label: 'Test Label',
        text: 'Initial Text',
        onReady: readySpy,
      },
    }).then(({ wrapper }) => {
      cy.get('@readySpy')
        .should('have.been.calledOnce')
        .then(() => {
          cy.get('[data-cy="text-text"]').should('have.value', 'Initial Text');

          wrapper.setProps({ text: 'New Text' });

          cy.get('[data-cy="text-text"]').should('have.value', 'New Text');
        });
    });
  });
});
