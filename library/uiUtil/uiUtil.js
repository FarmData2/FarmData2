/**
 * @module uiUtil
 *
 * @description Utility functions related to user interface elements.
 */

import { useToast } from 'bootstrap-vue-next';

let toast = undefined;

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
 * @param {number} duration - The duration of the toast message in seconds. This defaults to 1 hour (i.e. until dismissed).
 */
export function showToast(title, message, placement, variant, duration = 3600) {
  toast = useToast().show(message, {
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
 * Hides the currently shown toast message.
 */
export function hideToast() {
  if (toast) {
    useToast().hide(toast);
    toast = undefined;
  }
}
