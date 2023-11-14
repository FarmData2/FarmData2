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
    cy.mount(CommentBox);
    cy.get('[data-cy="comment-input"]').should('be.visible');
  });
});
