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
    /*
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    cy.mount(CommentBox);

    cy.get('[data-cy="comment-input"]').should('exist');
  });
});
