<template>
  <h3>CommentBox Example</h3>
  <p data-cy="description">
    The CommentBox Component allows the user to type a comment.
  </p>

  <hr />
  <CommentBox
    id="comment-box"
    data-cy="comment-box"
    v-model:comment="form.comment"
    v-on:valid="
      (valid) => {
        validity.comment = valid;
      }
    "
    v-on:ready="createdCount++"
  />
  <hr />

  <h5>Component Props:</h5>
  <table class="example-table">
    <thead>
      <th>Prop</th>
      <th>Control</th>
    </thead>
    <tbody>
      <tr>
        <td>comment</td>
        <td>
          <BButton
            id="insert-comment-button"
            data-cy="insert-comment-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.comment = 'comment'"
          >
            Insert Comment
          </BButton>
          <BButton
            id="clear-comment-button"
            data-cy="clear-comment-button"
            variant="outline-primary"
            size="sm"
            v-on:click="this.form.comment = ''"
          >
            Clear Comment
          </BButton>
        </td>
      </tr>
    </tbody>
  </table>

  <h5>Component Event Payloads</h5>
  <table class="example-table">
    <thead>
      <th>Event</th>
      <th>Payload</th>
    </thead>
    <tbody>
      <tr>
        <td>update:comment</td>
        <td>{{ form.comment }}</td>
      </tr>
      <tr>
        <td>valid</td>
        <td>{{ validity.comment }}</td>
      </tr>
    </tbody>
  </table>

  <div
    data-cy="page-loaded"
    v-show="false"
  >
    {{ pageDoneLoading }}
  </div>
</template>

<script>
import CommentBox from '@comps/CommentBox/CommentBox.vue';
import { BButton } from 'bootstrap-vue-next';

export default {
  components: {
    CommentBox,
    BButton,
  },
  data() {
    return {
      form: {
        comment: '',
      },
      validity: {
        comment: true,
      },
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 2;
    },
  },
  created() {
    this.createdCount++;
  },
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

/**
 * This ensures that the css for this file is picked up by the builder.
 * Not sure why this is necessary, but without it the css imports
 * above are not processed.
 */
date-selector-hack {
  display: none;
}
</style>
