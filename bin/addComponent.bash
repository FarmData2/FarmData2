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
  echo -e "${ON_RED}ERROR:${NO_COLOR} The working tree must be clean to add a component."
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

# Check if the directory for the component exits...
COMPONENT_SRC_DIR="$COMPONENTS_DIR/$COMPONENT_NAME"
if [ -d "$COMPONENT_SRC_DIR" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} A directory for the component $COMPONENT_NAME already exists"
  echo "in the directory $COMPONENTS_DIR."
  echo "Pick a different name for your Component."
  echo "OR:"
  echo "  Remove the $COMPONENT_SRC_DIR directory"
  echo "Then run this script again."
  exit 255
fi

echo "About to add a component as follows:"
echo "        Component name: $COMPONENT_NAME"
echo "  Components directory: $COMPONENTS_DIR"
echo "   Component directory: $COMPONENT_SRC_DIR"
echo "        Feature branch: $FEATURE_BRANCH_NAME"
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

# Create a new directory for the component.
echo "  Creating directory $COMPONENT_SRC_DIR for component..."
mkdir "$COMPONENT_SRC_DIR"
echo "  Created."

# Create a new feature branch for the component from the development branch
echo "  Updating development branch..."
git switch --quiet development
git pull --quiet origin development
error_check "Failed to update development branch."
echo "  Updated."
echo "  Creating new feature branch $FEATURE_BRANCH_NAME from development..."
git branch --quiet "$FEATURE_BRANCH_NAME"
echo "  Created."
echo "  Switching to feature branch $FEATURE_BRANCH_NAME..."
git switch --quiet "$FEATURE_BRANCH_NAME"
echo "  Switched."

# Copy templates over to component directory
COMPONENT_TEMPLATE_DIR="$SCRIPT_DIR/templates/component"

echo "  Creating component's files from templates..."
echo "    Creating $COMPONENT_NAME.vue from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.vue" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.vue"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.vue"
echo "    Creating."
echo "    Creating $COMPONENT_NAME.content.comp.cy.js from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.content.comp.cy.js" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.content.comp.cy.js"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.content.comp.cy.js"
echo "    Created."
echo "    Creating $COMPONENT_NAME.events.comp.cy.js from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.events.comp.cy.js" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.events.comp.cy.js"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.events.comp.cy.js"
echo "    Created."
echo "    Creating $COMPONENT_NAME.behavior.comp.cy.js from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.behavior.comp.cy.js" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.behavior.comp.cy.js"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.behavior.comp.cy.js"
echo "    Created."
echo "  Created."

echo "Created."



