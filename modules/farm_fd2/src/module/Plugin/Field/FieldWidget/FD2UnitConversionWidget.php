<?php

/*
 * This field adapted from: https://www.drupal.org/project/entity_reference_quantity/releases/3.1.0
 */

namespace Drupal\farm_fd2\Plugin\Field\FieldWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldWidget\EntityReferenceAutocompleteWidget;

/**
 * Plugin implementation of the 'fd2_unit_conversion_widget' widget.
 * 
 * @FieldWidget(
 *   id = "fd2_unit_conversion_widget",
 *   label = @Translation("Unit conversion widget"),
 *   module = "farm_fd2",
 *   description = @Translation("An autocomplete for unit reference and a number for the conversion factor."),
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

    $widget['factor'] = [
      '#placeholder' => 'Factor',
      '#type' => 'number',
      '#size' => '10',
      '#precision' => '2',
      '#step' => '0.01',
      '#min' => '0',
      '#default_value' => isset($items[$delta]) ? $items[$delta]->factor : 1,
      '#weight' => 10,
    ];

    return $widget;
  }

  /**
   * {@inheritdoc}
   */
  public function massageFormValues(array $values, array $form, FormStateInterface $form_state) {
    $values = parent::massageFormValues($values, $form, $form_state);
    foreach ($values as $delta => $data) {
      if (empty($data['factor'])) {
        unset($values[$delta]['factor']);
      }
    }
    return $values;
  }
}
