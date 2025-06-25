#!/bin/bash

# Get the branch to deploy
BRANCH=${1:-"development"}

# Switch to the branch to deploy
cd ~/FarmData2 || exit
git switch "$BRANCH"

# Installing FD2 Dependencies
echo "Installing dependencies..."
npm ci
echo "Installed."

# Build the FD2 modules.
echo "Building the FD2 modules..."
echo "  FarmData2..."
sg fd2grp "npm run build:fd2"
echo "  Examples..."
sg fd2grp "npm run build:examples"
echo "  School..."
sg fd2grp "npm run build:school"
echo "Built."

# Installing the sample Database
echo "Installing the sample database..."
cd ~/FarmData2/bin || exit
./installDB.bash
echo "Installed."

# Removing the examples and school modules.
echo "Uninstalling the examples and school modules..."
docker exec fd2_farmos drush pm-uninstall farm_fd2_examples -y
docker exec fd2_farmos drush pm-uninstall farm_fd2_school -y
docker exec fd2_farmos drush cr
echo "Uninstalled."