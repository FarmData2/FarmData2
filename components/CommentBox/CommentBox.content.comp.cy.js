import CommentBox from '@comps/CommentBox/CommentBox.vue';

describe('Test the default CommentBox content', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check that the comment box is visible', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CommentBox, {
      props: {
        onReady: readySpy,
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="comment-input"]').should('be.visible');
      });
  });

  it('Check that the comment field takes and trims initial value', () => {
    const readySpy = cy.spy().as('readySpy');

    cy.mount(CommentBox, {
      props: {
        onReady: readySpy,
        comment: '  \n  \t  Test comment.   \t\n ',
      },
    });

    cy.get('@readySpy')
      .should('have.been.calledOnce')
      .then(() => {
        cy.get('[data-cy="comment-input"]').should(
          'have.value',
          'Test comment.'
        );
      });
  });
});
