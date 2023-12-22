<?php
/**
 * @file
 * Contains \Drupal\farm_fd2\Controller\FD2_Controller.
 */
namespace Drupal\farm_fd2\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

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

  public function permissions()
  {
    // List each permissions to be checked here.
    $perms = [
      'create land asset',
      'create plant asset',
      'create structure asset',
      'create terms in tray_size',
    ];

    foreach ($perms as $perm) {
      $perm_name = str_replace(' ', '-', $perm);
      $result[$perm_name] = \Drupal::currentUser()->hasPermission($perm);
    }

    return new JsonResponse([
      'permissions' => $result,
      'method' => 'GET',
      'status' => 200,
    ]);
  }
}
