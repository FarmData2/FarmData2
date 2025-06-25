#!/bin/bash

source colors.bash
source lib.bash

PWD="$(pwd)"

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

echo -e "${GREEN}Generating FarmData2 documentation.${NO_COLOR}."

echo "  Deleting old docs..."
rm -rf docs/components 2 &> /dev/null
mkdir docs/components
rm -rf docs/library 2 &> /dev/null
mkdir docs/library
echo "  Deleted."

echo "  Creating index file: $INDEX_FILE..."
INDEX_FILE="FarmData2.md"
INDEX_PATH="$REPO_ROOT_DIR/docs/$INDEX_FILE" # Absolute path.
echo "# FarmData2 Documentation" > "$INDEX_PATH"
echo "" >> "$INDEX_PATH"
echo "  Created."

echo "  Generating docs for all Components..."
echo "    Adding Components section to $INDEX_FILE..."
{
  echo "## Components"
  echo ""
  echo "| Name | Description |"
  echo "|------|-------------|"
} >> "$INDEX_PATH"
echo "    Added."

safe_cd "$REPO_ROOT_DIR/components"
DIRS=$(ls -d -- */)
safe_cd "$REPO_ROOT_DIR"

for DIR in $DIRS; do                     # Names of the components with a trailing /
  COMP_NAME=$(echo "$DIR" | cut -d/ -f1) # Only the name of the component
  COMP_VUE_PATH="components/$COMP_NAME/$COMP_NAME.vue"
  COMP_MD_FILE="$COMP_NAME.md"
  DOCS_DIR="docs"

  echo "    Generating docs for $COMP_NAME..."
  echo "      Creating docs for $COMP_NAME..."
  # vue-docgen expects paths relative to components directory.
  npx vue-docgen "$COMP_VUE_PATH" "$DOCS_DIR"
  # Get rid of the extra directory layer that we don't need.
  mv "$DOCS_DIR/components/$COMP_NAME/$COMP_MD_FILE" "$DOCS_DIR/components/$COMP_MD_FILE"
  rmdir "$DOCS_DIR/components/$COMP_NAME"
  echo "      Created."

  echo "      Adding link for $COMP_MD_FILE to $INDEX_FILE..."
  DESC_TEXT=$(grep -m 1 -A 1 "/\*\*" "$COMP_VUE_PATH" | tail -1 | cut -d' ' -f3-)
  COMP_MD_LINK="components/$COMP_MD_FILE" # Link is relative to docs.
  echo "| [$COMP_NAME]($COMP_MD_LINK) | $DESC_TEXT |" >> "$INDEX_PATH"
  echo "      Added."

  echo "      Adding back links from $COMP_MD_FILE to $INDEX_FILE..."
  TMP_PATH="docs/components/$COMP_NAME.tmp"
  {
    echo "[[FarmData2 Documentation]](../$INDEX_FILE)"
    echo ""
    cat "docs/components/$COMP_MD_FILE"
    echo ""
    echo "[[FarmData2 Documentation]](../$INDEX_FILE)"
  } >> "$TMP_PATH"
  mv -f "$TMP_PATH" "docs/components/$COMP_MD_FILE"
  echo "      Added."
  echo "    Generated."
done
echo "  Generated."

echo "  Generating docs for all libraries..."

echo "    Adding Library section to $INDEX_FILE..."
{
  echo "## Library"
  echo ""
  echo "| Name | Description |"
  echo "|------|-------------|"
} >> "$INDEX_PATH"
echo "    Added."

safe_cd "$REPO_ROOT_DIR/library"
LIBS=$(ls -d -- */)
safe_cd "$REPO_ROOT_DIR"

for LIB in $LIBS; do                      # Names of the libraries with a trailing /
  if [ "$LIB" != "cypress/" ]; then       # skip the cypress directory
    LIB_NAME=$(echo "$LIB" | cut -d/ -f1) # Only the name of the library
    LIB_JS_PATH="library/$LIB_NAME"
    LIB_JS_MAIN_FILE="library/$LIB_NAME/$LIB_NAME.js"
    LIB_MD_FILE="$LIB_NAME.md"
    LIB_MD_PATH="docs/library/$LIB_MD_FILE"

    echo "    Generating docs for $LIB_NAME..."
    echo "      Creating docs for $LIB_NAME..."

    # Generate docs for the main library file which may be a barrel file
    # Docs for additional .js files (e.g. those exported from the barrel)
    # will be added to this page.
    echo "        Adding docs for main library file: $LIB_JS_MAIN_FILE..."
    npx jsdoc2md "$LIB_JS_MAIN_FILE" > "$LIB_MD_PATH"
    sed -i "s/^## $LIB_NAME/# $LIB_NAME/g" "$LIB_MD_PATH"

    # Loop over and document any additional .js files
    LS_CMD="ls $LIB_JS_PATH/*.js"
    JS_FILES=$($LS_CMD)
    HEAD_LINKS_FILE="/var/tmp/headLinks.md"
    {
      echo "## Sections"
      echo ""
      echo "| Name | Description |"
      echo "|------|-------------|"
    } > "$HEAD_LINKS_FILE"
    FUNC_LINKS_FILE="/var/tmp/funcLinks.md"
    echo "## Functions" > "$FUNC_LINKS_FILE"
    FUNC_DESC_FILE="/var/tmp/funcDesc.md"
    echo "## Function Details" > "$FUNC_DESC_FILE"

    IS_BARREL=0
    for JS_FILE_PATH in $JS_FILES; do
      JS_FILE_NAME=$(basename "$JS_FILE_PATH")
      if [ "$JS_FILE_NAME" != "$LIB_NAME.js" ] && [[ "$JS_FILE_NAME" != *".unit.cy.js" ]]; then
        IS_BARREL=1

        echo "        Adding docs for $JS_FILE_NAME..."
        # Add section link and description to the table.
        SECT_DESC=$(head -n 2 "$JS_FILE_PATH" | tail -1 | cut -d' ' -f3-)
        SECT_NAME=$(echo "$JS_FILE_NAME" | cut -d'.' -f2)
        echo "[$SECT_NAME](#$JS_FILE_NAME) | $SECT_DESC" >> "$HEAD_LINKS_FILE"

        # List and link to the details of each function in the file.
        echo "<a name=\"$JS_FILE_NAME\"></a>" >> "$FUNC_LINKS_FILE"
        echo "* [$SECT_NAME](#$SECT_NAME-details) \
          [[$JS_FILE_NAME]](../../library/$LIB_NAME/$JS_FILE_NAME) - $SECT_DESC" >> "$FUNC_LINKS_FILE"
        NPX_CMD="npx jsdoc2md $JS_FILE_PATH"
        NUM_HEAD_LINES=$($NPX_CMD | tail -n+3 | grep -n '^<a name' | head -1 | cut -d: -f1)
        if [ "$NUM_HEAD_LINES" == "" ]; then
          NUM_HEAD_LINES=$($NPX_CMD | tail -n+3 | grep -n '^$' | head -1 | cut -d: -f1)
        fi
        HEAD_LINES=$($NPX_CMD | head -n "$NUM_HEAD_LINES" | grep "<dt><a" \
          | cut -d'>' -f2- | sed 's/.....$//' | sed 's/^/  * /')
        echo "$HEAD_LINES" >> "$FUNC_LINKS_FILE"

        # Give all of the function details
        FUNC_DETAILS=$($NPX_CMD | tail -n +"$NUM_HEAD_LINES" | sed 's/^##/###/g')
        {
          echo "<a name=\"$SECT_NAME-details\"></a>"
          echo "## $(echo "$JS_FILE_NAME" | cut -d'.' -f2)"
          echo "$FUNC_DETAILS"
        } >> "$FUNC_DESC_FILE"
      fi
    done

    # Add these if this library is a barrel file...
    if [ $IS_BARREL -eq 1 ]; then
      {
        cat "$HEAD_LINKS_FILE"
        cat "$FUNC_LINKS_FILE"
        cat "$FUNC_DESC_FILE"
      } >> "$LIB_MD_PATH"
    fi

    echo "      Created."

    echo "      Adding link for $LIB_MD_FILE to $INDEX_FILE..."
    DESC_TEXT=$(grep "@description" "$LIB_JS_MAIN_FILE" | cut -d' ' -f4-)
    LIB_MD_LINK="library/$LIB_MD_FILE" # Link is relative to docs.
    echo "| [$LIB_NAME]($LIB_MD_LINK) | $DESC_TEXT |" >> "$INDEX_PATH"
    echo "      Added."

    echo "      Adding back links from $LIB_MD_FILE to $INDEX_FILE..."
    TMP_PATH="docs/library/$LIB_NAME.tmp"
    echo "[[FarmData2 Documentation]](../$INDEX_FILE)" > "$TMP_PATH"
    {
      echo ""
      cat "docs/library/$LIB_MD_FILE"
      echo ""
      echo "[[FarmData2 Documentation]](../$INDEX_FILE)"
    } >> "$TMP_PATH"
    mv -f "$TMP_PATH" "docs/library/$LIB_MD_FILE"
    echo "      Added."

    echo "    Generated."
  fi
done
echo "  Generated."

echo -e "${GREEN}Done.${NO_COLOR}"
