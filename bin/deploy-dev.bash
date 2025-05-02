#!/bin/bash

# This script will deploy the development branch on a server 
# (E.g. DigitalOcean, etc).  The server must have git, docker
# and npm installed.
#
# The purpose of the script is to deploy an instance for testing.
# This is not the recommended way to deploy for production use.

# Define some useful variables, import libraries
source colors.bash
source lib.bash

SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.
safe_cd "$REPO_ROOT_DIR"

safe_cd "$REPO_ROOT_DIR"

echo -e "${UNDERLINE_BLUE}Deploying FarmData2 development branch...${NO_COLOR}"

# Ensuring this script is not being run as root.
RUNNING_AS_ROOT=$(id -un | grep "root")
if [ -n "$RUNNING_AS_ROOT" ]; then
  echo -e "${RED}ERROR:${NO_COLOR}The deploy-dev.bash script should not be run as root."
  echo "Please run deploy-dev.bash without using sudo."
  exit 255
fi

# Check for git, docker and npm dependencies
echo "  Checking system dependencies..."
GIT=$(which git)
DOCKER=$(which docker)
NPM=$(which npm)
if [ ! "$GIT" ]; then
  echo "    Git must be installed to run deploy-dev.bash"
fi
if [ ! "$DOCKER" ]; then
  echo "    Docker must be installed to run deploy-dev.bash"
fi
if [ ! "$NPM" ]; then
  echo "    npm must be installed to run deploy-dev.bash"
fi
if [ ! "$GIT" ] || [ ! "$DOCKER" ] || [ ! "$NPM" ]; then
  exit 255
fi
echo "  Dependencies met."

# Ensure that this script is not being run in the development container.
HOST=$(docker inspect -f '{{.Name}}' "$HOSTNAME" 2> /dev/null)
if [ "$HOST" == "/fd2_dev" ]; then
  echo -e "${RED}ERROR:${NO_COLOR} deploy-dev.bash script cannot be run in the dev container."
  echo "Always run deploy-dev.bash on the host."
  exit 255
fi

# Update the development branch from origin
echo "  Updating development branch..."
git switch --quiet development
#git pull --quiet origin development
error_check "  Failed to update development branch."
echo "  Updated."

# Install npm dependencies
echo "  Installing project dependencies..."
npm ci --omit dev > /dev/null
echo "  Installed."

# Bring up farmOS and postgres
echo "Removing any stale containers..."
docker rm fd2_postgres &> /dev/null
docker rm fd2_farmos &> /dev/null

echo "Starting containers..."
safe_cd "$REPO_ROOT_DIR/docker"

# Note: Any command line args are passed to the docker compose up command
docker compose up -d "$@"

# Build the FD2 module
echo "  Building farm_fd2 module..."
npm run build:fd2 &> /dev/null
echo "  Built."

# Install the sample DB
echo "  Installing the sample database..."
bin/installDB.bash > /dev/null
echo "  Installed."

# Remove the FD2 Examples and School modules.
echo "  Uninstalling the FD2 Examples module..."
docker exec fd2_farmos drush pm-uninstall farm_fd2_examples -y
error_check "Unable to uninstall the examples module."
echo "  Uninstalled."
echo "  Uninstalling the FD2 School module..."
s drush pm-uninstall farm_fd2_school -y
error_check "Unable to uninstall the school module."
echo "  Uninstalled"

echo "  Clearing the Drupal cache..."
docker exec fd2_farmos drush cr
error_check "Unable to clear the cache."
echo "  Drupal cache cleared."

# Prompt for new default passwords and change them.
