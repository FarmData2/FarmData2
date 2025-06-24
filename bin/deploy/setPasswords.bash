#!/bin/bash

# Change the passwords for each of the farmOS/drupal users created by the sample database.
echo "When entering passwords, the password will not be displayed."
echo "Press enter when finished entering a password."
echo ""

# Get and set the admin password.
read -srp "Enter admin password: " ADMIN_PWD
docker exec fd2_farmos drush user:password admin "$ADMIN_PWD"

# Get the password for the managers.
read -srp "Enter manager password: " MANAGER_PWD
docker exec fd2_farmos drush user:password manager1 "$MANAGER_PWD"
docker exec fd2_farmos drush user:password manager2 "$MANAGER_PWD"

# Get the password for the workers.
read -srp "Enter worker password: " WORKER_PWD
docker exec fd2_farmos drush user:password worker1 "$WORKER_PWD"
docker exec fd2_farmos drush user:password worker2 "$WORKER_PWD"
docker exec fd2_farmos drush user:password worker3 "$WORKER_PWD"
docker exec fd2_farmos drush user:password worker4 "$WORKER_PWD"
docker exec fd2_farmos drush user:password worker5 "$WORKER_PWD"

# Get the password for the guest.
read -srp "Enter guest password: " GUEST_PWD
docker exec fd2_farmos drush user:password guest "$GUEST_PWD"
