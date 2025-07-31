<?php

/*
 * This field adapted from: https://www.drupal.org/project/entity_reference_quantity/releases/3.1.0
 */

namespace Drupal\farm_fd2\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldFormatter\EntityReferenceLabelFormatter;
use Drupal\Core\Form\FormStateInterface;
use Drupal\taxonomy\Entity\Term;

/**
 * Plugin implementation of the 'fd2_unit_conversion_formatter' formatter.
 *
 * @FieldFormatter(
 *   id = "fd2_unit_conversion_formatter",
 *   label = @Translation("Unit and conversion factor"),
 *   module = "farm_fd2",
 *   description = @Translation("Display the unit and the conversion factor."),
 *   field_types = {
 *     "fd2_unit_conversion"
 *   }
 * )
 */
class FD2UnitConversionFormatter extends EntityReferenceLabelFormatter
{
  /**
   * {@inheritdoc}
   */
  public static function defaultSettings()
  {
    return [
      'location' => 'suffix',
      'template' => ' ({{ factor }} = 1 {{base_unit}})',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode)
  {
    $elements = parent::viewElements($items, $langcode);
    $values = $items->getValue();

    $parentEntity = $items->getParent()->getEntity();
    $base_unit_id = $parentEntity->get('fd2_harvest_unit')->getValue()[0][
      'target_id'
    ];
    $base_unit_name = \Drupal\taxonomy\Entity\Term::load($base_unit_id)->get(
      'name'
    )->value;

    foreach ($elements as $delta => $entity) {
      if (!empty($values[$delta]['factor'])) {
        /** @var \Drupal\Core\Template\TwigEnvironment $environment */
        $environment = \Drupal::service('twig');

        $output = $environment->renderInline($this->getSetting('template'), [
          'factor' => $values[$delta]['factor'],
          'base_unit' => $base_unit_name,
        ]);

        $elements[$delta]['#suffix'] = $output;
      }
    }

    return $elements;
  }
}
