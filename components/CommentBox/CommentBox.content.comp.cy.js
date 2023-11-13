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

  it('Check all of the default data-cy elements', () => {
    cy.mount(CommentBox);
    cy.get('[data-cy="comment-input"]').should('be.visible');
  });

  it('Check that text is trimmed', () => {
    cy.mount(CommentBox);
    cy.get('[data-cy="comment-input"]').type('  This is a test comment.  ');
    cy.get('[data-cy="comment-input"]').blur(); // lazy v-model handling.
  });
});
