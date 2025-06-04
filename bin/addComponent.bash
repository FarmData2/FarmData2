#!/bin/bash

source colors.bash
source lib.bash

PWD="$(pwd)"

function usage {
  echo "addEntryComponent.bash usage:"
  echo "  -h|--help : Display this message."
  echo ""
  echo "  -d|--dev: Create the new entry component from the current branch"
  echo "            instead of from the development branch."
  echo "            This is useful for testing changes to the templates."
  echo ""
  exit 255
}

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

# Process the command line flags
FLAGS=$(getopt -o d::h::m:: \
  --long dev::,help::,min:: \
  -- "$@")
error_check "Unrecognized option provided."
eval set -- "$FLAGS"

while true; do
  case $1 in
    -d | --dev)
      DEV_FLAG=1
      shift 2
      ;;
    -h | --help)
      usage
      ;;
    --)
      shift
      break
      ;;
    *)
      usage
      ;;
  esac
done

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
ENTRY_POINT_TEMPLATE_DIR="$REPO_ROOT_DIR/bin/templates/entrypoint"
# Convert CamelCase COMPONENT_NAME to snake_case COMPONENT_ID
COMPONENT_ID=$(echo "$COMPONENT_NAME" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//')
EXAMPLE_SRC_DIR="$EXAMPLES_DIR/$COMPONENT_ID"
EXAMPLE_MODULE_DIR="$REPO_ROOT_DIR/modules/farm_fd2_examples"
ROUTING_YML_FILE="$EXAMPLE_MODULE_DIR/src/module/farm_fd2_examples.routing.yml"
LINKS_YML_FILE="$EXAMPLE_MODULE_DIR/src/module/farm_fd2_examples.links.menu.yml"
LIBRARIES_YML_FILE="$EXAMPLE_MODULE_DIR/src/module/farm_fd2_examples.libraries.yml"

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

# Check if the directory for the example entry point exits...
if [ -d "$EXAMPLE_SRC_DIR" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} A directory for the example $COMPONENT_ID already exists"
  echo "in the directory $EXAMPLES_DIR."
  echo "Pick a different name for your Component."
  echo "OR:"
  echo "  Remove the $EXAMPLE_SRC_DIR directory"
  echo "Then run this script again."
  exit 255
fi

# Check that the example entry point is not already in the module .yml files.
IN_ROUTES=$(grep "^farm.fd2_examples_$COMPONENT_ID.content:$" "$ROUTING_YML_FILE")
IN_LINKS=$(grep "^farm.fd2_$COMPONENT_ID:$" "$LINKS_YML_FILE")
IN_LIBRARIES=$(grep "^$COMPONENT_ID:$" "$LIBRARIES_YML_FILE")

# Check that the entry point information is not already in any of the .yml files.
if [[ ! ("$IN_ROUTES" == "" && "$IN_LINKS" == "" && "$IN_LIBRARIES" == "") ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The entry point $COMPONENT_ID was previously defined."
  echo "Remove definitions related to the entry point $COMPONENT_ID from the files:"
  echo "  $ROUTING_YML_FILE"
  echo "  $LINKS_YML_FILE"
  echo "  $LIBRARIES_YML_FILE"
  echo "Then run this script again."
  exit 255
fi

# Define some additional Drupal specific variables.
DRUPAL_ROUTE_PREFIX="fd2_examples"
DRUPAL_ROUTE="$DRUPAL_ROUTE_PREFIX""\/$COMPONENT_ID"
DRUPAL_ROUTE_NAME="$DRUPAL_ROUTE_PREFIX""_$COMPONENT_ID"
# shellcheck disable=SC1003
DISPLAY_DRUPAL_ROUTE=$(echo "$DRUPAL_ROUTE" | tr -d '\\')
DRUPAL_PERMISSIONS="access content"

echo "About to add a component and example page for the component as follows:"
echo "           Component name: $COMPONENT_NAME"
echo "             Component ID: $COMPONENT_ID"
echo "     Components directory: $COMPONENTS_DIR"
echo "      Component directory: $COMPONENT_SRC_DIR"
echo " Example Module directory: $EXAMPLE_MODULE_DIR"
echo "       Examples directory: $EXAMPLES_DIR"
echo "        Example directory: $EXAMPLE_SRC_DIR"
echo "           Feature branch: $FEATURE_BRANCH_NAME"
echo "            drupal route: $DISPLAY_DRUPAL_ROUTE"
echo "       drupal route name: $DRUPAL_ROUTE_NAME"
echo "    permissions required: $DRUPAL_PERMISSIONS"
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
echo ""
echo "Creating new component $COMPONENT_NAME"

if [ -z "$DEV_FLAG" ]; then
  # Create a new feature branch for the entrypoint from the development branch
  echo "  Updating development branch..."
  git switch --quiet development
  git pull --quiet origin development
  error_check "Failed to update development branch."
  echo "  Updated."
  echo "  Creating new feature branch $FEATURE_BRANCH_NAME from development..."
  git branch --quiet "$FEATURE_BRANCH_NAME"
  error_check "Failed to create feature branch $FEATURE_BRANCH_NAME."
  echo "  Created."
else
  # Create a new feature branch for the entrypoint from the current branch
  # Used for testing changes to the templates.
  echo "  Creating new feature branch $FEATURE_BRANCH_NAME from current branch..."
  git branch --quiet "$FEATURE_BRANCH_NAME"
  error_check "Failed to create feature branch $FEATURE_BRANCH_NAME."
  echo "  Created."
fi

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
sleep 1
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
echo ""

# Run the included component tests to be sure everything is working...
echo "  Running component tests on $COMPONENT_NAME..."
COMP_TEST_OUT=$(test.bash --comp --glob="components/**/$COMPONENT_NAME/*.comp.cy.js")
COMP_TEST_EXIT_CODE=$?
echo "  Component tests complete."

if [ ! "$COMP_TEST_EXIT_CODE" == "0" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} New component failed the initial component tests."
  echo ""
  echo -e "$COMP_TEST_OUT"
  echo ""
  echo "  Try again by:"
  echo "    Commit all changes to the current git branch: $FEATURE_BRANCH_NAME."
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
sleep 1
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/App.vue"
echo "    Created."

echo "    Creating index.html from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/index.html" "$EXAMPLE_SRC_DIR/index.html"
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$EXAMPLE_SRC_DIR/index.html"
sleep 1
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/index.html"
echo "    Created."

echo "    Creating $COMPONENT_ID.html from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/new_component.html" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.html"
sleep 1
sed -i "s/%COMPONENT_NAME%/$COMPONENT_NAME/g" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.html"
sleep 1
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.html"
echo "    Created."

echo "    Copying $COMPONENT_ID.js from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/new_component.js" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.js"
echo "    Copied."

echo "    Creating $COMPONENT_ID.exists.e2e.cy.js from templates..."
cp "$EXAMPLE_TEMPLATE_DIR/new_component.exists.e2e.cy.js" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.exists.e2e.cy.js"
sed -i "s/%COMPONENT_ID%/$COMPONENT_ID/g" "$EXAMPLE_SRC_DIR/$COMPONENT_ID.exists.e2e.cy.js"
echo "    Created."

echo "  Created."

# Add the new example entry point to the farm_fd2_examples drupal Module by adding to the
# libraries, links.menu and routing  yml files.

echo "  Adding new example entry point to drupal Module files..."

echo "    Updating $LIBRARIES_YML_FILE from templates..."
cat "$ENTRY_POINT_TEMPLATE_DIR/libraries.yml" >> "$LIBRARIES_YML_FILE"
sed -i "s/%ENTRY_POINT%/$COMPONENT_ID/g" "$LIBRARIES_YML_FILE"
echo "    Updated."

echo "    Updating $LINKS_YML_FILE from templates..."
ENTRY_POINT_TITLE="$COMPONENT_NAME"
ENTRY_POINT_DESCRIPTION="Example of the use of the $COMPONENT_NAME component."
ENTRY_POINT_PARENT="farm.fd2_examples_component_examples"

cat "$ENTRY_POINT_TEMPLATE_DIR/links.menu.yml" >> "$LINKS_YML_FILE"
sed -i "s/%ENTRY_POINT_TITLE%/$ENTRY_POINT_TITLE/g" "$LINKS_YML_FILE"
sleep 1
sed -i "s/%ENTRY_POINT_DESCRIPTION%/$ENTRY_POINT_DESCRIPTION/g" "$LINKS_YML_FILE"
sleep 1
sed -i "s/%ENTRY_POINT_PARENT%/$ENTRY_POINT_PARENT/g" "$LINKS_YML_FILE"
sleep 1
sed -i "s/%DRUPAL_ROUTE_NAME%/$DRUPAL_ROUTE_NAME/g" "$LINKS_YML_FILE"
echo "    Updated."

echo "    Updating $ROUTING_YML_FILE from templates..."
cat "$ENTRY_POINT_TEMPLATE_DIR/routing.yml" >> "$ROUTING_YML_FILE"
sed -i "s/%DRUPAL_ROUTE_NAME%/$DRUPAL_ROUTE_NAME/g" "$ROUTING_YML_FILE"
sleep 1
sed -i "s/%DRUPAL_ROUTE%/$DRUPAL_ROUTE/g" "$ROUTING_YML_FILE"
sleep 1
sed -i "s/%MODULE_NAME%/farm_fd2_examples/g" "$ROUTING_YML_FILE"
sleep 1
sed -i "s/%ENTRY_POINT_TITLE%/$ENTRY_POINT_TITLE/g" "$ROUTING_YML_FILE"
sleep 1
sed -i "s/%ENTRY_POINT_PERMISSIONS%/$DRUPAL_PERMISSIONS/g" "$ROUTING_YML_FILE"
echo "    Updated."
echo "  Added."
echo ""

echo "  Running e2e tests on $COMPONENT_NAME example..."
TEST_FILE="modules/farm_fd2_examples/src/entrypoints/$COMPONENT_ID/$COMPONENT_ID.exists.e2e.cy.js"
E2E_TEST_OUT=$(test.bash --e2e --live --examples --glob="$TEST_FILE" 2> /dev/null)
E2E_EXIT_CODE=$?
echo "  E2e tests complete."

if [ ! "$E2E_EXIT_CODE" == "0" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} Example page has failed e2e tests."
  echo ""
  echo -e "$E2E_TEST_OUT"
  echo ""

  echo "  Try again by:"
  echo "    Commit all changes to the feature branch: $FEATURE_BRANCH_NAME."
  echo "    Switch to the development branch"
  echo "    Delete the $FEATURE_BRANCH_NAME branch."
  echo "    Run this script again."

  exit "$E2E_EXIT_CODE"
else
  echo -e "${ON_GREEN}SUCCESS:${NO_COLOR} New component example page for $COMPONENT_NAME created."
  echo ""
fi

#
# Rebuild the component_examples entry point so that the list includes the new component.
#

echo "Rebuilding component_examples entry point..."
"$SCRIPT_DIR/buildCompExListPage.bash"
echo "Rebuilt."
echo ""

#
# Wrap it up...
#

# Commit the changes to the feature branch and print some info...
echo "Committing starter code to the new feature branch: $FEATURE_BRANCH_NAME."
safe_cd "$REPO_ROOT_DIR"
git add .
git commit --quiet -m "Add starter code for $COMPONENT_NAME component." --no-verify
error_check "Failed to commit changes to $FEATURE_BRANCH_NAME."
echo "Committed."
echo ""

# Give some instruction on what to do next...
echo "To complete your new component:"
echo "  * Modify the components/$COMPONENT_NAME/$COMPONENT_NAME.vue file to create the desired functionality"
echo "  * Edit the examples/$COMPONENT_ID/$COMPONENT_ID.vue file and manually test the component."
echo "  * Edit the $COMPONENT_NAME.*.comp.cy.js files to perform automated testing."
echo "  * Add additional *.comp.cy.js files as necessary to fully test the the component."
echo "  * Ensure that the component is fully documented."
echo "  * Run npm run docs:gen and verify documentation is complete."
echo "  * Run the buildCompExListPage.bash script."
echo "  * When ready, push your feature branch to your origin and create a pull request."
echo ""
