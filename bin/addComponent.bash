#!/bin/bash

source colors.bash
source lib.bash

PWD="$(pwd)"

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

# Check that working tree is clean
GIT_STATUS=$(git status | tail -1)
if [[ ! "$GIT_STATUS" =~ ^"nothing to commit, working tree clean"$ ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The working tree must be clean to add an entry point."
  echo "Commit changes to a feature branch or use git stash."
  echo "Then run this script again."
  exit 255
fi

# Switch to the components directory.
COMPONENTS_DIR="$REPO_ROOT_DIR/components"
safe_cd "$COMPONENTS_DIR"

# Get the name for the new Component.
read -rp "Name for new component (CamelCase 2 words minimum): " COMPONENT_NAME
echo ""

FEATURE_BRANCH_NAME="add_$COMPONENT_NAME""_component"

# Check if a feature branch already exists for the component...
FEATURE_BRANCH_EXISTS=$(git branch -a | grep "$FEATURE_BRANCH_NAME")
if [[ ! "$FEATURE_BRANCH_EXISTS" == "" ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The feature branch $FEATURE_BRANCH_NAME already exists."
  echo "Pick a different name for your component."
  echo "Or delete the feature branch $FEATURE_BRANCH_NAME."
  echo "Then run this script again."
  exit 255
fi

echo "About to add a component as follows:"
echo "       component directory: $COMPONENTS_DIR"
echo "               component name: $COMPONENT_NAME"
echo "   feature branch: $FEATURE_BRANCH_NAME"
echo ""

# Confirm that the component should be created.
Y_N=""
while [[ "$Y_N" != "Y" && "$Y_N" != "y" ]]; do
  read -rp "Continue (Y/N)? " Y_N
  echo ""

  if [[ "$Y_N" == "n" || "$Y_N" == "N" ]]; then
    echo "Component creation canceled."
    exit 255
  fi
done


echo "Creating new component $COMPONENT_NAME"

exit -1

# Create a new feature branch for the component from the development branch
echo "  Updating development branch..."
git switch development
git pull origin development
echo "  Updated."
echo "  Creating new feature branch $FEATURE_BRANCH_NAME from development..."
git branch "$FEATURE_BRANCH_NAME"
echo "  Created."
echo "  Switching to feature branch $FEATURE_BRANCH_NAME..."
git switch "$FEATURE_BRANCH_NAME"
echo "  Switched.

echo "Crated."

# Check that the development branch is checked out
# CUR_GIT_BRANCH=$(git branch)
# if [[ ! "$CUR_GIT_BRANCH" == *"* development"* ]]; then
#   echo -e "${ON_RED}ERROR:${NO_COLOR} You must have the development branch checked out to add an entry point."
#   echo "Switch to the development branch."
#   echo "Then run this script again."
#   exit 255
# fi



