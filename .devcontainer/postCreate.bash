#!/bin/bash

# This runs once after the container is created and the source is available.
# This installs npm dependencies and builds the modules and docs.

REPO_DIR=$(git rev-parse --show-toplevel)

echo "Adding FarmData2/bin to the PATH..."
echo "" >> ~/.bashrc \
  && echo "export PATH=$PATH:/workspaces/FarmData2/bin" >> ~/.bashrc
echo "FarmData2/bin added."

# echo "Installing npm dependencies..."
# echo "NPM dependencies installed on $(date)." > npm-ci.log
# echo "" >> npm-ci.log
# npm ci --no-fund --loglevel=error --quiet &>> npm-ci.log
# echo "Installed."

echo "Setting up git hooks..."
cd "$REPO_DIR/.git" || { echo " Error .git directory does not exist."; exit 1; }
rm -rf hooks
ln -s ../.githooks hooks
cd "$REPO_DIR" || { echo " Error repo directory does not exist."; exit 1; }
echo "Set up."

# Redirect both stdout and stderr to /dev/null because
# the sample database is not yet installed so these will
# generate errors, but they will still work as expected
# once the sample database is installed.
# echo "Building FarmData2 Drupal modules..."
# echo "  Building farm_fd2..."
# rm -rf "$REPO_DIR/modules/farm_fd2/dist" &> /dev/null
# mkdir "$REPO_DIR/modules/farm_fd2/dist" &> /dev/null
# npm run build:fd2 &> /dev/null
# echo "  Built."
# echo "  Building farm_fd2_examples..."
# rm -rf "$REPO_DIR/modules/farm_fd2_examples/dist" &> /dev/null
# mkdir "$REPO_DIR/modules/farm_fd2_examples/dist" &> /dev/null
# npm run build:examples &> /dev/null
# echo "  Built."
# echo "  Building farm_fd2_school..."
# rm -rf "$REPO_DIR/modules/farm_fd2_school/dist" &> /dev/null
# mkdir "$REPO_DIR/modules/farm_fd2_school/dist" &> /dev/null
# npm run build:school &> /dev/null
# echo "  Built."
# echo "All modules built."

echo "Building FarmData2 documentation."
echo -n "  This takes a few minutes."
npm run docs:gen &> /dev/null &
DOC_PID=$!
while kill -0 $DOC_PID 2> /dev/null; do
  echo -n "."
  sleep 3
done
echo ""
echo "Documentation built."