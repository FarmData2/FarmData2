#!/bin/bash

# Get the directory of the FarmData2 repository.
REPO_DIR=$(git rev-parse --show-toplevel)

# Get the branch to deploy
BRANCH=${1:-"development"}

# Switch to the branch to deploy
cd "$REPO_DIR" || exit
git switch "$BRANCH"

# Installing FD2 Dependencies
echo "Installing dependencies..."
npm ci
echo "Installed."

# Generate a self-signed SSL certificate.
# It will be valid for 25 years - a test deployment is unlikely to live that long.
echo "Generating self-signed SSL certificate..."
rm -rf docker/ssl 2> /dev/null
mkdir docker/ssl 2> /dev/null
openssl req -x509 -nodes -newkey rsa:2048 \
  -days 9125 \
  -keyout "docker/ssl/farmos.key" \
  -out "docker/ssl/farmos.crt" \
  -subj "/C=US/ST=Development/L=Development/O=FarmData2/OU=Development/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:farmos,IP:127.0.0.1"
chmod 644 "docker/ssl/farmos.crt"
chmod 600 "docker/ssl/farmos.key"
echo "SSL certificate generated."

# Build the FD2 modules.
echo "Building the FD2 modules..."
echo "  FarmData2..."
rm -rf "$REPO_DIR/modules/farm_fd2/dist"
mkdir "$REPO_DIR/modules/farm_fd2/dist"
npm run build:fd2
echo "  Examples..."
rm -rf "$REPO_DIR/modules/farm_fd2_examples/dist"
mkdir "$REPO_DIR/modules/farm_fd2_examples/dist"
npm run build:examples
echo "  School..."
rm -rf "$REPO_DIR/modules/farm_fd2_school/dist"
mkdir "$REPO_DIR/modules/farm_fd2_school/dist"
npm run build:school
echo "Built."

# Installing the sample Database
echo "Installing the sample database..."
cd "$REPO_DIR/bin" || exit
./installDB.bash
echo "Installed."

# Removing the examples and school modules.
echo "Uninstalling the examples and school modules..."
docker exec fd2_farmos drush pm-uninstall farm_fd2_examples -y
docker exec fd2_farmos drush pm-uninstall farm_fd2_school -y
docker exec fd2_farmos drush cr
echo "Uninstalled."