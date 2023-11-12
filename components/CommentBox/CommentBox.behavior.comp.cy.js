import CommentBox from '@comps/CommentBox/CommentBox.vue';

describe('Test the CommentBox component behavior', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Add tests for behavior here', () => {
    /*
     * See `components/README.md` for information about component testing.
     * See other components in the `components/` directory for examples.
     */

    cy.mount(CommentBox);

    cy.get('[data-cy="comment-input"]').should('exist');
  });
});
