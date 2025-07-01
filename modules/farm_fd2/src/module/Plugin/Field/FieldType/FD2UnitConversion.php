<?php

/*
 * This field adapted from: https://www.drupal.org/project/entity_reference_quantity/releases/3.1.0
 */

namespace Drupal\farm_fd2\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'fd2_unit_conversion' field type.
 *
 * @FieldType(
 *   id = "fd2_unit_conversion",
 *   module = "farm_fd2",
 *   label = @Translation("Unit conversion"),
 *   description = @Translation("A unit reference and a conversion factor."),
 *   category = "Reference",
 *   default_widget = "fd2_unit_conversion_widget",
 *   default_formatter = "fd2_unit_conversion_formatter",
 *   list_class = "\Drupal\Core\Field\EntityReferenceFieldItemList" * )
 */
class FD2UnitConversion extends EntityReferenceItem {

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties = parent::propertyDefinitions($field_definition);
    $quantity_definition = DataDefinition::create('float')
      ->setLabel(t('Quantity'));
    $properties['quantity'] = $quantity_definition;
    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = parent::schema($field_definition);
    $schema['columns']['quantity'] = [
      'type' => 'float',
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  // public static function defaultFieldSettings() {
  //   return [
  //     'qty_label' => t('Quantity'),
  //     'qty_min' => 0,
  //     'qty_max' => 999,
  //   ] + parent::defaultFieldSettings();
  // }

  /**
   * {@inheritdoc}
   */
  // public function fieldSettingsForm(array $form, FormStateInterface $form_state) {
  //   $elements = parent::fieldSettingsForm($form, $form_state);

  //   $elements['qty_min'] = [
  //     '#type' => 'number',
  //     '#title' => t('Minimum'),
  //     '#default_value' => $this->getSetting('qty_min'),
  //   ];
  //   $elements['qty_max'] = [
  //     '#type' => 'number',
  //     '#title' => t('Maximum'),
  //     '#default_value' => $this->getSetting('qty_max'),
  //   ];
  //   $elements['qty_label'] = [
  //     '#type' => 'textfield',
  //     '#title' => t('Quantity Label'),
  //     '#default_value' => $this->getSetting('qty_label'),
  //     '#description' => $this->t('Also used as a placeholder in multi-value instances.'),
  //   ];

  //   return $elements;
  // }

  /**
   * {@inheritdoc}
   */
  public static function getPreconfiguredOptions() {
    return [];
  }

}
