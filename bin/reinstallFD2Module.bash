#!/bin/bash

echo "Deleting custom fd2_fields..."
docker exec fd2_farmos drush php-eval "\Drupal\field\Entity\FieldStorageConfig::loadByName('taxonomy_term', 'fd2_unit_conversions')->delete();"
docker exec fd2_farmos drush php-eval "\Drupal\field\Entity\FieldStorageConfig::loadByName('taxonomy_term', 'fd2_harvest_unit')->delete();"
echo "Deleted."
echo "Running cron..."
docker exec fd2_farmos drush cron > /dev/null 2>&1
echo "Done."

echo "Uninstalling farm_fd2 module..."
docker exec fd2_farmos drush pmu farm_fd2 -y
echo "Uninstalled."

echo "Rebuilding farm_fd2 module..."
npm run build:fd2 > /dev/null
echo "Rebuilt."

echo "Reinstalling farm_fd2 module..."
docker exec fd2_farmos drush en farm_fd2 -y
echo "Reinstalled."
