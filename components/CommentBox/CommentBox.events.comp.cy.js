import CommentBox from '@comps/CommentBox/CommentBox.vue';

describe('Test the CommentBox component events', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Emits "ready" when comment box has been created', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CommentBox, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="comment-input"]').should('exist');
      });
  });

  it('Emits "update:comment" when the comment changes', () => {
    const readySpy = cy.spy().as('readySpy');
    const updateSpy = cy.spy().as('updateSpy');

    cy.mount(CommentBox, {
      props: {
        onReady: readySpy,
        'onUpdate:comment': updateSpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('@updateSpy').should('not.have.been.called');

        cy.get('[data-cy="comment-input"]').type('This is a test.');
        cy.get('[data-cy="comment-input"]').blur(); // lazy v-model handling.

        cy.get('@updateSpy').should('have.been.calledOnce');
        cy.get('@updateSpy').should('have.been.calledWith', 'This is a test.');
      });
  });
});
