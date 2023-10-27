#!/bin/bash

source colors.bash
source lib.bash

PWD="$(pwd)"

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

# Check that the main branch is checked out
CUR_GIT_BRANCH=$(git branch)
if [[ ! "$CUR_GIT_BRANCH" == *"* main"* ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} You must have the main branch checked out to add an entry point."
  echo "Switch to the main branch."
  echo "Then run this script again."
  exit 255
fi

# Check that working tree is clean
GIT_STATUS=$(git status | tail -1)
if [[ ! "$GIT_STATUS" =~ ^"nothing to commit, working tree clean"$ ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The working tree must be clean to add an entry point."
  echo "Commit changes to a feature branch or use git stash."
  echo "Then run this script again."
  exit 255
fi

# Get the module to which the endpoint should be added.
ALLOWED_MODULES=("farm_fd2" "farm_fd2_examples" "farm_fd2_school")
echo "Choose the module in which an entry point should be created."
select MODULE_NAME in "${ALLOWED_MODULES[@]}"; do
  if (("$REPLY" <= 0 || "$REPLY" > "${#ALLOWED_MODULES[@]}")); then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Invalid choice. Please try again."
  else
    break
  fi
done
DRUPAL_ROUTE_PREFIX="${MODULE_NAME:5}"
echo ""

# Switch to the directory for the module to which the entry point is being added.
MODULE_DIR="$REPO_ROOT_DIR/modules/$MODULE_NAME"
safe_cd "$MODULE_DIR"

# Get the name for the new entry point.
read -rp "Name for new entry point (snake_case): " ENTRY_POINT
echo ""

DRUPAL_ROUTE="$DRUPAL_ROUTE_PREFIX""\/$ENTRY_POINT"
ENTRY_POINT_SRC_DIR="$MODULE_DIR/src/entrypoints/$ENTRY_POINT"
ENTRY_POINT_TEMPLATE_DIR="$SCRIPT_DIR/templates/entrypoints"
DRUPAL_ROUTE_NAME="$DRUPAL_ROUTE_PREFIX""_$ENTRY_POINT"
FEATURE_BRANCH_NAME="add_$ENTRY_POINT""_entry_point"

# Check if a feature branch already exists for the entry point...
FEATURE_BRANCH_EXISTS=$(git branch -a | grep "$FEATURE_BRANCH_NAME")
if [[ ! "$FEATURE_BRANCH_EXISTS" == "" ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The feature branch $FEATURE_BRANCH_NAME already exists."
  echo "Pick a different name for your entry point."
  echo "Or delete the feature branch $FEATURE_BRANCH_NAME."
  echo "Then run this script again."
  exit 255
fi

# Check if the directory for the entry point exits...
if [ -d "src/entrypoints/$ENTRY_POINT" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} A directory for the entry point $ENTRY_POINT already exists"
  echo "in the directory $$ENTRY_POINT_SRC_DIR."
  echo "Pick a different name for your entry point."
  echo "OR:"
  echo "  Remove the src/entrypoints/$ENTRY_POINT directory"
  echo "  And remove any definitions related to the entry point $ENTRY_POINT from the files:"
  echo "    $ROUTING_YML_FILE"
  echo "    $LINKS_YML_FILE"
  echo "    $LIBRARIES_YML_FILE"
  echo "Then run this script again."
  exit 255
fi

# Define the module .yml file paths for convenience.
ROUTING_YML_FILE="src/module/$MODULE_NAME.routing.yml"
LINKS_YML_FILE="src/module/$MODULE_NAME.links.menu.yml"
LIBRARIES_YML_FILE="src/module/$MODULE_NAME.libraries.yml"

# Check that the entry point is not already defined.
IN_ROUTES=$(grep "^farm.fd2_$ENTRY_POINT.content:$" "$ROUTING_YML_FILE")
IN_LINKS=$(grep "^farm.fd2_$ENTRY_POINT:$" "$LINKS_YML_FILE")
IN_LIBRARIES=$(grep "^$ENTRY_POINT:$" "$LIBRARIES_YML_FILE")

# The directory for the entry point does not exist.
# So now check if the entry point has information in any of the .yml files.
if [[ ! ("$IN_ROUTES" == "" && "$IN_LINKS" == "" && "$IN_LIBRARIES" == "") ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The entry point $ENTRY_POINT was previously defined."
  echo "Remove definitions related to the entry point $ENTRY_POINT from the files:"
  echo "  $ROUTING_YML_FILE"
  echo "  $LINKS_YML_FILE"
  echo "  $LIBRARIES_YML_FILE"
  echo "Then run this script again."
  exit 255
fi

# Get a title and a description for the farmOS drupal module.
echo "Enter a title (2-5 words) for the entry point."
read -r ENTRY_POINT_TITLE
echo ""
echo "Enter a short (one 5-10 word sentence) description of the entry point."
read -r ENTRY_POINT_DESCRIPTION
echo ""

# Get the possible menus on which to post the entry point and
# ask the user to pick one.
MENUS_RAW=$(grep -v "^ " "$LINKS_YML_FILE" | cut -f1 -d: | tr '\n' ' ')
IFS=$' ' read -r -a MENUS <<< "$MENUS_RAW"

echo "Choose the parent menu on which this entry point will appear."
select ENTRY_POINT_PARENT in "${MENUS[@]}"; do
  if (("$REPLY" <= 0 || "$REPLY" > "${#MENUS[@]}")); then
    echo "Invalid choice. Please try again."
  else
    break
  fi
done
echo ""

# ****
# *** NEED TO DEAL WITH Permissions - ????
# ***

# shellcheck disable=SC1003
DISPLAY_DRUPAL_ROUTE=$(echo "$DRUPAL_ROUTE" | tr -d '\\')

echo "About to add an entry point as follows:"
echo "               in module: $MODULE_NAME"
echo "        module directory: $MODULE_DIR"
echo "        entry point name: $ENTRY_POINT"
echo "   entry point directory: $ENTRY_POINT_SRC_DIR"
echo "      template directory: $ENTRY_POINT_TEMPLATE_DIR"
echo "                   title: $ENTRY_POINT_TITLE"
echo "             description: $ENTRY_POINT_DESCRIPTION"
echo "            drupal route: $DISPLAY_DRUPAL_ROUTE"
echo "       drupal route name: $DRUPAL_ROUTE_NAME"
echo ""

# Confirm that the entry point should be created.
Y_N=""
while [[ "$Y_N" != "Y" && "$Y_N" != "y" ]]; do
  read -rp "Continue (Y/N)? " Y_N
  echo ""

  if [[ "$Y_N" == "n" || "$Y_N" == "N" ]]; then
    echo "Entry point creation canceled."
    exit 255
  fi
done

# Create a new feature branch for the entry point.
git branch "$FEATURE_BRANCH_NAME"
echo "Created feature branch '$FEATURE_BRANCH_NAME"
git switch "$FEATURE_BRANCH_NAME"
echo ""

# Make the directory for the entrypoint and populate it with the template files.
mkdir "$ENTRY_POINT_SRC_DIR"
echo "Created entry point directory '$ENTRY_POINT_SRC_DIR"

cp "$ENTRY_POINT_TEMPLATE_DIR/App.vue" "$ENTRY_POINT_SRC_DIR"
sed -i "s/%ENTRY_POINT%/$ENTRY_POINT/g" "$ENTRY_POINT_SRC_DIR/App.vue"
echo "  Added $ENTRY_POINT_SRC_DIR/App.vue from templates."

cp "$ENTRY_POINT_TEMPLATE_DIR/entry_point.exists.cy.js" "$ENTRY_POINT_SRC_DIR/$ENTRY_POINT.exists.cy.js"
sed -i "s/%ENTRY_POINT%/$ENTRY_POINT/g" "$ENTRY_POINT_SRC_DIR/$ENTRY_POINT.exists.cy.js"
sed -i "s/%DRUPAL_ROUTE%/$DRUPAL_ROUTE/g" "$ENTRY_POINT_SRC_DIR/$ENTRY_POINT.exists.cy.js"
sed -i "s/%MODULE_NAME%/$MODULE_NAME/g" "$ENTRY_POINT_SRC_DIR/$ENTRY_POINT.exists.cy.js"
echo "  Added $ENTRY_POINT_SRC_DIR/$ENTRY_POINT.exists.cy.js from templates."

cp "$ENTRY_POINT_TEMPLATE_DIR/index.html" "$ENTRY_POINT_SRC_DIR/index.html"
sed -i "s/%ENTRY_POINT_TITLE%/$ENTRY_POINT_TITLE/g" "$ENTRY_POINT_SRC_DIR/index.html"
sed -i "s/%ENTRY_POINT%/$ENTRY_POINT/g" "$ENTRY_POINT_SRC_DIR/index.html"
echo "  Added $ENTRY_POINT_SRC_DIR/index.html from templates."

cp "$ENTRY_POINT_TEMPLATE_DIR/entry_point.js" "$ENTRY_POINT_SRC_DIR/$ENTRY_POINT.js"
echo "  Added $ENTRY_POINT_SRC_DIR/$ENTRY_POINT.js from templates."
echo ""

# Make the new entry point into a drupal Module by adding to the
# libraries, links.menu and routing  yml files.
cat "$ENTRY_POINT_TEMPLATE_DIR/libraries.yml" >> "$LIBRARIES_YML_FILE"
sed -i "s/%ENTRY_POINT%/$ENTRY_POINT/g" "$LIBRARIES_YML_FILE"
echo "Updated $LIBRARIES_YML_FILE from templates."

cat "$ENTRY_POINT_TEMPLATE_DIR/links.menu.yml" >> "$LINKS_YML_FILE"
sed -i "s/%ENTRY_POINT_TITLE%/$ENTRY_POINT_TITLE/g" "$LINKS_YML_FILE"
sed -i "s/%ENTRY_POINT_DESCRIPTION%/$ENTRY_POINT_DESCRIPTION/g" "$LINKS_YML_FILE"
sed -i "s/%ENTRY_POINT_PARENT%/$ENTRY_POINT_PARENT/g" "$LINKS_YML_FILE"
sed -i "s/%DRUPAL_ROUTE_NAME%/$DRUPAL_ROUTE_NAME/g" "$LINKS_YML_FILE"
echo "Updated $LINKS_YML_FILE from templates."

cat "$ENTRY_POINT_TEMPLATE_DIR/routing.yml" >> "$ROUTING_YML_FILE"
sed -i "s/%DRUPAL_ROUTE_NAME%/$DRUPAL_ROUTE_NAME/g" "$ROUTING_YML_FILE"
sed -i "s/%DRUPAL_ROUTE%/$DRUPAL_ROUTE/g" "$ROUTING_YML_FILE"
sed -i "s/%MODULE_NAME%/$MODULE_NAME/g" "$ROUTING_YML_FILE"
sed -i "s/%ENTRY_POINT_TITLE%/$ENTRY_POINT_TITLE/g" "$ROUTING_YML_FILE"
echo "Updated $ROUTING_YML_FILE from templates."
echo ""

# Run the basic tests to be sure everything is working...
# Note: The test script does the builds for the preview and live farmOS servers.
TEST_MODULE=${MODULE_NAME##*_}
TEST_FILE="modules/$MODULE_NAME/src/entrypoints/$ENTRY_POINT/$ENTRY_POINT.exists.cy.js"

echo "Running tests on $ENTRY_POINT in the $MODULE_NAME module..."

echo "  Testing on dev server..."
DEV_TEST_OUT=$(test.bash --e2e --dev --"$TEST_MODULE" --glob="$TEST_FILE")
DEV_EXIT_CODE=$?
if [ ! "$DEV_EXIT_CODE" == "0" ]; then
  echo "  Errors occurred when testing on the dev server. Output will be shown below"
else
  echo "  Success."
fi

echo "  Testing on preview server..."
PREV_TEST_OUT=$(test.bash --e2e --prev --"$TEST_MODULE" --glob="$TEST_FILE")
PREV_EXIT_CODE=$?
if [ ! "$PREV_EXIT_CODE" == "0" ]; then
  echo "  Errors occurred when testing on the preview server. Output will be shown below"
else
  echo "  Success."
fi

echo "  Testing on farmOS server..."
LIVE_TEST_OUT=$(test.bash --e2e --live --"$TEST_MODULE" --glob="$TEST_FILE")
LIVE_EXIT_CODE=$?
if [ ! "$LIVE_EXIT_CODE" == "0" ]; then
  echo "  Errors occurred when testing on the farmOS server. Output will be shown below"
else
  echo "  Success."
fi

echo "Tests complete."
echo ""

((TESTS_PASSED = DEV_EXIT_CODE || PREV_EXIT_CODE || LIVE_EXIT_CODE))

if [ ! "$TESTS_PASSED" == "0" ]; then
  if [ ! "$DEV_EXIT_CODE" == "0" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Failed tests from dev server."
    echo ""
    echo -e "$DEV_TEST_OUT"
    echo ""
  fi
  if [ ! "$PREV_EXIT_CODE" == "0" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Failed tests from preview server."
    echo ""
    echo -e "$PREV_TEST_OUT"
    echo ""
  fi
  if [ ! "$LIVE_EXIT_CODE" == "0" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Failed tests from farmOS server."
    echo ""
    echo -e "$LIVE_TEST_OUT"
    echo ""
  fi

  echo -e "${ON_RED}ERROR:${NO_COLOR} Check output of failed tests above."
  echo "  Correct any errors and rerun tests using test.bash."
  echo "  Or try again by:"
  echo "    Commit changes to the current git branch: $FEATURE_BRANCH_NAME."
  echo "    Switch to the main branch"
  echo "    Delete the $FEATURE_BRANCH_NAME branch."
  echo "    Run this script again."
else
  # Print a message...
  echo -e "${ON_GREEN}SUCCESS:${NO_COLOR} New entry point $ENTRY_POINT created in module $MODULE_NAME."

  # Commit the changes to the feature branch and print some info...
  echo "Use git status to review the changes."
  echo "Commit them to the current git branch: $FEATURE_BRANCH_NAME."
  echo "Modify the $MODULE_NAME/$ENTRY_POINT/App.vue file to create the desired functionality"
  echo "Add additional *.cy.js files to test the added functionality."
  echo "When ready, push your feature branch to your origin and create a pull request."
  echo ""
fi

exit "$TESTS_PASSED"
