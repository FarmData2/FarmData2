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
 *   id = "fd2_unit_conversions",
 *   module = "farm_fd2",
 *   label = @Translation("Unit conversion"),
 *   description = @Translation("A unit reference and a conversion factor."),
 *   category = "Reference",
 *   default_widget = "fd2_unit_conversion_widget",
 *   default_formatter = "fd2_unit_conversion_formatter",
 *   list_class = "\Drupal\Core\Field\EntityReferenceFieldItemList" * )
 */
class FD2UnitConversion extends EntityReferenceItem
{
  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(
    FieldStorageDefinitionInterface $field_definition
  ) {
    $properties = parent::propertyDefinitions($field_definition);
    $quantity_definition = DataDefinition::create('float')->setLabel(
      t('Factor')
    );
    $properties['factor'] = $quantity_definition;
    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(
    FieldStorageDefinitionInterface $field_definition
  ) {
    $schema = parent::schema($field_definition);
    $schema['columns']['factor'] = [
      'type' => 'float',
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public static function getPreconfiguredOptions()
  {
    return [];
  }
}
