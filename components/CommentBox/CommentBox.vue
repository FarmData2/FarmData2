<template>
  <div>
    <!-- Extra div here prevents vue optimization that hides the enclosing
       element in the page. E.g. The `seeding-comment` element in the
       tray_seeding page. Including this in components with only one element
       ensures that cy.get() works consistently across all components in the
       tests.
    -->
    <BFormTextarea
      id="comment-input"
      data-cy="comment-input"
      placeholder="Enter a comment..."
      lazy
      v-model="commentText"
      v-bind:formatter="(value) => value.trim()"
    />
  </div>
</template>

<script>
/**
 * The CommentBox component provides a UI element that allows the user to enter a comment.
 *
 * ## Usage Example
 *
 * ```html
 * <CommentBox
 *   id="seeding-comment"
 *   data-cy="seeding-comment"
 *   v-model:comment="form.comment"
 *   v-on:valid="validity.comment = $event"
 *   v-on:ready="createdCount++"
 * />
 * ```
 *
 * ## `data-cy` Attributes
 *
 * Attribute Name        | Description
 * ----------------------| -----------
 * `comment-input`       | the `BFormTextarea` element where the comment is typed.
 */
export default {
  name: 'CommentBox',
  components: {},
  emits: ['ready', 'update:comment', 'valid'],
  props: {
    /**
     * The text of the comment.  The provided text is trimmed of leading and trailing whitespace.
     * This prop is watched and changes are relayed to the component's internal state..
     */
    comment: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      commentText: this.comment ? this.comment.trim() : null,
    };
  },
  computed: {
    isValid() {
      return true;
    },
  },
  methods: {},
  watch: {
    comment() {
      if (this.comment) {
        this.commentText = this.comment.trim();
      } else {
        this.commentText = null;
      }
    },
    commentText() {
      /**
       * The comment has been edited.
       * @property {String} comment the new comment trimmed of leading and trailing whitespace.
       */
      this.$emit('update:comment', this.commentText);
    },
    isValid() {
      /**
       * The validity of the component has changed.  Also emitted when the component is created.
       * @property {Boolean} valid `true` if the component's value is valid; `false` if it is invalid.
       */
      this.$emit('valid', this.isValid);
    },
  },
  created() {
    //Emit the initial valid state of the component's value.
    this.$emit('valid', this.isValid);

    /**
     * The component is ready for use.
     */
    this.$emit('ready');
  },
};
</script>
