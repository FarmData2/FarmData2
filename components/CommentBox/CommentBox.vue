<template>
  <BFormTextarea
    id="comment-input"
    data-cy="comment-input"
    placeholder="Enter a comment..."
    v-model="comment"
  />
</template>

<script>
/**
 * A CommentBox provides a UI element that allows the user to enter a comment.
 *
 * ## Usage Example
 *
 * ```html
 * Add example of how to add this component to a template.
 * See the other components in the `components` directory for examples.
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
  props: {},
  data() {
    return {
      comment: '',
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
      /**
       * The comment has been edited.
       * @property {String} comment the new comment.
       */
      this.$emit('update:comment', this.comment);
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
