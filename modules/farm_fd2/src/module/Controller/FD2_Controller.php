<?php
/**
 * @file
 * Contains \Drupal\farm_fd2\Controller\FD2_Controller.
 */
namespace Drupal\farm_fd2\Controller;

use Drupal\Core\Controller\ControllerBase;

class FD2_Controller extends ControllerBase
{
  public function content()
  {
    // Get the name of the FarmData service being requested from the URL
    // e.g. main ...
    $current_path = \Drupal::service('path.current')->getPath();

    // Offset here (5) must match prefix: fd2/
    $fd2_service = substr($current_path, 5);

    return [
      'app' => [
        '#markup' => '<div id="app"></div>',
        '#attached' => [
          'library' => ['farm_fd2/' . $fd2_service],
        ],
      ],
    ];
  }
}
