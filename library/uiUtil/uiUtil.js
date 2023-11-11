/**
 * @module uiUtil
 *
 * @description Utility functions related to user interface elements.
 */

import { useToast } from 'bootstrap-vue-next';

/**
 * Shows a toast message with the given title, message, placement, variant, and duration.
 * The toast can be dismissed by clicking the _close_ button or it will be automatically
 * dismissed after the specified duration.
 *
 * @param {string} title - The title of the toast message.
 * @param {string} message - The message to show in the toast.
 * @param {string} placement - The placement of the toast message. Valid placements
 * are: `top-left`, `top-center`, `top-right`, `middle-left`, `middle-center`,
 * `middle-right`, `bottom-left`, `bottom-center`, and`bottom-right`.
 * @param {string} variant - The variant of the toast message. Valid variants are:
 * `primary`, `secondary`, `success`, `danger`, `warning`, and `info`, `light`, and `dark`.
 * @param {number} duration - The duration of the toast message in seconds.
 */
export function showToast(title, message, placement, variant, duration) {
  useToast().show(message, {
    variant: variant,
    pos: placement,
    title: title,
    value: duration * 1000,
    interval: duration * 50,
    progressProps: {
      variant: 'secondary',
    },
  });
}

/**
 * Indicates when a component's styling should reflect the value of isValid.
 *
 * This function is called by the `showInvalidStyling` computed property
 * in a components to control the styling.  It is defined here to ensure
 * that it is consistent across all components.
 *
 * If the conventions defined in `components/README.md` and `modules/README.md`
 * are followed this function ensures that:
 *   - the green check anytime the value is valid.
 *   - the red X when submit is clicked and the value is invalid.
 *
 * @param {boolean} isValid - the value of the `isValid` computed property in the component.
 * @param {boolean} showInvalidStyling - the value of the `showInvalidStyling` prop in the component.
 * @returns {*} `true`, `false`, or `null`. `true` indicates that valid styling should be applied. `false` indicates that invalid styling should be applied. `null` indicates that no styling should be applied.
 */
export function validationStyling(isValid, showInvalidStyling) {
  if (isValid) {
    return true;
  } else {
    if (showInvalidStyling) {
      return isValid;
    } else {
      return null;
    }
  }
}
