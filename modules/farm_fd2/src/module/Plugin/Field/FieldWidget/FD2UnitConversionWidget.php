<?php

/*
 * This field adapted from: https://www.drupal.org/project/entity_reference_quantity/releases/3.1.0
 */

namespace Drupal\farm_fd2\Plugin\Field\FieldWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldWidget\EntityReferenceAutocompleteWidget;

/**
 * @FieldWidget(
 *   id = "fd2_unit_conversion_widget",
 *   label = @Translation("Autocomplete"),
 *   description = @Translation("An autocomplete text field with associated data."),
 *   field_types = {
 *     "fd2_unit_conversion"
 *   }
 * )
 */
class FD2UnitConversionWidget extends EntityReferenceAutocompleteWidget {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $widget = [
      '#attributes' => ['class' => ['form--inline', 'clearfix']],
      '#theme_wrappers' => ['container'],
    ];
    $widget['target_id'] = parent::formElement($items, $delta, $element, $form, $form_state);
    $widget['quantity'] = [
      '#type' => 'number',
      '#size' => '4',
      '#default_value' => isset($items[$delta]) ? $items[$delta]->quantity : 1,
      '#weight' => 10,
    ];

    if ($this->fieldDefinition->getFieldStorageDefinition()->isMultiple()) {
      $widget['quantity']['#placeholder'] = $this->fieldDefinition->getSetting('qty_label');
    }
    else {
      $widget['quantity']['#title'] = $this->fieldDefinition->getSetting('qty_label');
    }

    return $widget;
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    $values = parent::massageFormValues($values, $form, $form_state);
    foreach ($values as $delta => $data) {
      if (empty($data['quantity'])) {
        unset($values[$delta]['quantity']);
      }
    }
    return $values;
  }

}
