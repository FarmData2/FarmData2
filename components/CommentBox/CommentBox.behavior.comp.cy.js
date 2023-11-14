import CommentBox from '@comps/CommentBox/CommentBox.vue';

describe('Test the CommentBox behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Check that text is trimmed', () => {
    cy.mount(CommentBox);
    cy.get('[data-cy="comment-input"]').type(
      '  \n \tThis is a\n\ttest comment.  \n  \t'
    );
    cy.get('[data-cy="comment-input"]').blur();
    cy.get('[data-cy="comment-input"]').should(
      'have.value',
      'This is a\n\ttest comment.'
    );
  });
});
