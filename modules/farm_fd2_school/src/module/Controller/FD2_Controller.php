<?php
/**
 * @file
 * Contains \Drupal\farm_fd2_school\Controller\FD2_Controller.
 */
namespace Drupal\farm_fd2_school\Controller;

use Drupal\Core\Controller\ControllerBase;

class FD2_Controller extends ControllerBase
{
  public function content()
  {
    // Get the name of the FarmData endpoint being requested from the URL
    // e.g. main or FieldKit or ...
    $current_path = \Drupal::service('path.current')->getPath();

    // Offset here (12) must match prefix: fd2_school/
    $fd2_service = substr($current_path, 12);

    return [
      'app' => [
        '#markup' => '<div id="app"></div>',
        '#attached' => [
          'library' => ['farm_fd2_school/' . $fd2_service],
        ],
      ],
    ];
  }
}
