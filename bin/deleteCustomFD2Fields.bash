#!/bin/bash

# This file contains only the commands that are needed to remove the custom
# fields that are added to farmOS by FarmData2.  The fields are added by the
# config files in modules/farm_fd2/src/module/config/install directory.
# See the fields.md documentation in contributing for more information.

docker exec fd2_farmos drush php-eval "\Drupal\field\Entity\FieldStorageConfig::loadByName('taxonomy_term', 'fd2_unit_conversions')->delete();"
docker exec fd2_farmos drush php-eval "\Drupal\field\Entity\FieldStorageConfig::loadByName('taxonomy_term', 'fd2_harvest_unit')->delete();"
