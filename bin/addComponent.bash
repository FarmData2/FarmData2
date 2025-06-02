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

# Get the name for the new Component.
read -rp "Name for new component (UpperCamelCase 2 words minimum): " COMPONENT_NAME
echo ""

if [[ ! $COMPONENT_NAME =~ ^[A-Z][a-z]+([A-Z][a-z]+)*$ ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} Component name must be UpperCamelCase."
  exit 255
fi
if [[ ! $COMPONENT_NAME =~ ^[A-Z][a-z]+([A-Z][a-z]+)+$ ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} Component name must be at least 2 words."
  exit 255
fi

# Check if a feature branch already exists for the component and the example page...
FEATURE_BRANCH_NAME="add_$COMPONENT_NAME""_component"
FEATURE_BRANCH_EXISTS=$(git branch -a | grep "$FEATURE_BRANCH_NAME")
if [[ ! "$FEATURE_BRANCH_EXISTS" == "" ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The feature branch $FEATURE_BRANCH_NAME already exists."
  echo "Pick a different name for your component."
  echo "Or delete the feature branch $FEATURE_BRANCH_NAME."
  echo "Then run this script again."
  exit 255
fi

# Define variables for the directories we'll be using.
COMPONENTS_DIR="$REPO_ROOT_DIR/components"
COMPONENT_SRC_DIR="$COMPONENTS_DIR/$COMPONENT_NAME"
EXAMPLES_DIR="$REPO_ROOT_DIR/modules/farm_fd2_examples/src/entrypoints"
# Convert CamelCase COMPONENT_NAME to snake_case COMPONENT_ID
COMPONENT_ID=$(echo "$COMPONENT_NAME" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//')
EXAMPLE_SRC_DIR="$EXAMPLES_DIR/$COMPONENT_ID"

# Check if the directory for the component exits...
if [ -d "$COMPONENT_SRC_DIR" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} A directory for the component $COMPONENT_NAME already exists"
  echo "in the directory $COMPONENTS_DIR."
  echo "Pick a different name for your Component."
  echo "OR:"
  echo "  Remove the $COMPONENT_SRC_DIR directory"
  echo "Then run this script again."
  exit 255
fi

# Check if the directory for the example exits...
if [ -d "$EXAMPLE_SRC_DIR" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} A directory for the example $COMPONENT_ID already exists"
  echo "in the directory $EXAMPLES_DIR."
  echo "Pick a different name for your Component."
  echo "OR:"
  echo "  Remove the $EXAMPLE_SRC_DIR directory"
  echo "Then run this script again."
  exit 255
fi

echo "About to add a component and example page for the component as follows:"
echo "        Component name: $COMPONENT_NAME (UpperCamelCase)"
echo "          Component ID: $COMPONENT_ID (snake_case)"
echo "  Components directory: $COMPONENTS_DIR"
echo "   Component directory: $COMPONENT_SRC_DIR"
echo "    Examples directory: $EXAMPLES_DIR"
echo "     Example directory: $EXAMPLE_SRC_DIR" 
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

#
# Create the new component
#
echo "Creating new component $COMPONENT_NAME"

# Create a new feature branch for the component from the development branch
echo "  Updating development branch..."
git switch --quiet development
git pull --quiet origin development
error_check "Failed to update development branch."
echo "  Updated."
echo "  Creating new feature branch $FEATURE_BRANCH_NAME from development..."
git branch --quiet "$FEATURE_BRANCH_NAME"
error_check "Failed to create feature branch $FEATURE_BRANCH_NAME."
echo "  Created."
echo "  Switching to feature branch $FEATURE_BRANCH_NAME..."
git switch --quiet "$FEATURE_BRANCH_NAME"
error_check "Failed to switch to feature branch $FEATURE_BRANCH_NAME."
echo "  Switched."

# Create a new directory for the component.
echo "  Creating directory $COMPONENT_SRC_DIR for component..."
safe_cd "$COMPONENTS_DIR"
mkdir "$COMPONENT_SRC_DIR"
error_check "Failed to create directory $COMPONENT_SRC_DIR."
echo "  Created."

# Copy templates over to component directory
COMPONENT_TEMPLATE_DIR="$SCRIPT_DIR/templates/component"

echo "  Creating component's files from templates..."
echo "    Creating $COMPONENT_NAME.vue from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.vue" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.vue"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.vue"
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.vue"
echo "    Created."

echo "    Creating $COMPONENT_NAME.content.comp.cy.js from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.content.comp.cy.js" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.content.comp.cy.js"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.content.comp.cy.js"
echo "    Created."

echo "    Creating $COMPONENT_NAME.styling.comp.cy.js from templates..."
cp "$COMPONENT_TEMPLATE_DIR/NewComponent.styling.comp.cy.js" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.styling.comp.cy.js"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$COMPONENT_SRC_DIR/$COMPONENT_NAME.styling.comp.cy.js"
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

# Run the included component tests to be sure everything is working...
echo "  Running component tests on $COMPONENT_NAME..."
COMP_TEST_OUT=$(test.bash --comp --glob="components/**/$COMPONENT_NAME/*.comp.cy.js")
COMP_TEST_EXIT_CODE=$?
if [ ! "$COMP_TEST_EXIT_CODE" == "0" ]; then
  echo "    Errors occurred when running the component tests. Output will be shown below"
else
  echo "    Success."
fi

if [ ! "$COMP_TEST_EXIT_CODE" == "0" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} New component failed the initial component tests."
  echo ""
  echo -e "$COMP_TEST_OUT"
  echo ""
  echo -e "${ON_RED}ERROR:${NO_COLOR} Check output of failed tests above."
  echo "  Correct any errors and rerun tests using:"
  echo "    test.bash --comp --glob=components/**/$COMPONENT_NAME/*.comp.cy.js"
  echo "  Or try again by:"
  echo "    Commit changes to the current git branch: $FEATURE_BRANCH_NAME."
  echo "    Switch to the development branch"
  echo "    Delete the $FEATURE_BRANCH_NAME branch."
  echo "    Run this script again."
  exit "$COMP_TEST_EXIT_CODE"
else
  echo -e "${ON_GREEN}SUCCESS:${NO_COLOR} New component $COMPONENT_NAME created."
  echo ""
fi

#
# Create the example page
#

echo "Creating new example $COMPONENT_ID..."

# Create a new directory for the example.
echo "  Creating directory $EXAMPLE_SRC_DIR for component..."
safe_cd "$EXAMPLES_DIR"
mkdir "$EXAMPLE_SRC_DIR"
error_check "Failed to create directory $EXAMPLE_SRC_DIR."
echo "  Created."

EXAMPLE_TEMPLATE_DIR="$SCRIPT_DIR/templates/example"

echo "  Creating component example page from templates..."
echo "    Creating App.vue from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/App.vue" "$EXAMPLE_SRC_DIR/App.vue"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$EXAMPLE_SRC_DIR/App.vue"
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/App.vue"
echo "    Created."

echo "    Creating index.html from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/index.html" "$EXAMPLE_SRC_DIR/index.html"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$EXAMPLE_SRC_DIR/index.html"
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/index.html"
echo "    Created."

echo "    Creating $COMPONENT_ID.html from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/new_component.html" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.html"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.html"
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.html"
echo "    Created."

echo "    Copying $COMPONENT_ID.js from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/new_component.js" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.js"
echo "    Copied."

echo "    Creating $COMPONENT_ID.exists.e2e.cy.js from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/new_component.exists.e2e.cy.js" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.exists.e2e.cy.js"
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.exists.e2e.cy.js"
echo "    Created."





### ALSO NEED TO INSERT INTO THE MODULE FILES FOR EXAMPLES!!!!!!





# Give some instruction on what to do next...
echo "  * Use git status to review the changes."
echo "  * Commit them to the current git branch: $FEATURE_BRANCH_NAME."
echo "  * Modify the components/$COMPONENT_NAME/$COMPONENT_NAME.vue file to create the desired functionality"
echo "  * Edit the examples/$COMPONENT_ID/$COMPONENT_ID.vue file to manually test the component."
echo "  * Edit the $COMPONENT_NAME.*.comp.cy.js files to perform testing."
echo "  * Add additional *.comp.cy.js files as necessary to fully test the the component."
echo "  * When ready, push your feature branch to your origin and create a pull request."
echo ""
