#!/bin/bash
# shellcheck disable=SC1091  # Make sources okay.

# Script that does much of the initial setup for the FD2 dev environment
# This script should only be run once when the dev environment is first setup.

# Define some useful variables, import libraries
source colors.bash
source lib.bash

SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

echo "Setting up the FarmData2 Development Environment..."
safe_cd "$REPO_ROOT_DIR"

echo "  Installing npm dependencies..."
npm ci > /dev/null
echo "  Installed."

echo ""

echo "  Setting up git hooks..."
safe_cd .git
rm -rf hooks
ln -s ../.githooks hooks
safe_cd ..
echo "  Set up."
echo ""

# echo "  Configuring vale linter..."
# if [ -f /usr/local/bin/vale ]; then
#   # Remove existing vale if it is left over from an old fd2dev docker container.
#   echo "fd2dev" | sudo -Sk -p "" rm /usr/local/bin/vale
# fi
# # Link to the version of vale installed by npm
# if [ ! -f "$REPO_ROOT_DIR"/bin/vale ]; then
#   echo "fd2dev" | sudo -Sk -p "" ln -s "$REPO_ROOT_DIR"/node_modules/@vvago/vale/bin/vale "$REPO_ROOT_DIR"/bin/vale
# fi
# vale sync
# echo "  Configured."
# echo ""

# UPSTREAM=$(git remote -v | grep "upstream.*https://github.com/FarmData2/FarmData2.git")
# if [ "$UPSTREAM" = "" ]; then
#   echo "    Setting the upstream remote..."
#   git remote add upstream https://github.com/FarmData2/FarmData2.git
#   echo "    Set."
# fi

# echo "  Configured."
# echo ""

# Redirect both stdout and stderr to /dev/null because
# the sample database is not yet installed so these will
# generate errors, but they will still work as expected
# once the sample database is installed.
echo "  Building FarmData2 Drupal modules..."
echo "    Building farm_fd2..."
rm -rf "$REPO_ROOT_DIR/modules/farm_fd2/dist" &> /dev/null
mkdir "$REPO_ROOT_DIR/modules/farm_fd2/dist" &> /dev/null
npm run build:fd2 &> /dev/null
echo "    Built."
echo "    Building farm_fd2_examples..."
rm -rf "$REPO_ROOT_DIR/modules/farm_fd2_examples/dist" &> /dev/null
mkdir "$REPO_ROOT_DIR/modules/farm_fd2_examples/dist" &> /dev/null
npm run build:examples &> /dev/null
echo "    Built."
echo "    Building farm_fd2_school..."
rm -rf "$REPO_ROOT_DIR/modules/farm_fd2_school/dist" &> /dev/null
mkdir "$REPO_ROOT_DIR/modules/farm_fd2_school/dist" &> /dev/null
npm run build:school &> /dev/null
echo "    Built."
echo "  Built."
echo ""

# echo "  Building documentation..."
# npm run docs:gen &> /dev/null
# echo "  Documentation built."
# echo ""

echo "  Installing the sample database..."
bin/installDB.bash > /dev/null
echo "  Installed."

echo "Setup."
