#!/bin/bash

source colors.bash
source lib.bash

PWD="$(pwd)"

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

if [ "$#" -eq 1 ]; then
    TARGET=$1
    echo -e "${GREEN}Generating documentation for $TARGET.${NO_COLOR}"
else
    TARGET="all"
    echo -e "${GREEN}Generating FarmData2 documentation for all components and libraries.${NO_COLOR}"
fi

echo "  Deleting old docs..."
rm -rf docs/components 2 &> /dev/null
mkdir docs/components
rm -rf docs/library 2 &> /dev/null
mkdir docs/library
echo "  Deleted."

echo "  Creating index file: $INDEX_FILE..."
INDEX_FILE="FarmData2.md"
INDEX_PATH="$REPO_ROOT_DIR/docs/$INDEX_FILE"
echo "# FarmData2 Documentation" > "$INDEX_PATH"
echo "" >> "$INDEX_PATH"
echo "  Created."

echo "  Generating docs for all Components..."
echo "    Adding Components section to $INDEX_FILE..."
echo "## Components" >> "$INDEX_PATH"
echo "" >> "$INDEX_PATH"
echo "    Added."

safe_cd "$REPO_ROOT_DIR/components"
DIRS=$(ls -d -- */)
safe_cd "$REPO_ROOT_DIR"

for DIR in $DIRS; do
    COMP_NAME=$(echo "$DIR" | cut -d/ -f1)
    if [ "$TARGET" == "$COMP_NAME" ] || [ "$TARGET" == "all" ]; then
        COMP_VUE_PATH="components/$COMP_NAME/$COMP_NAME.vue"
        COMP_MD_FILE="$COMP_NAME.md"
        DOCS_DIR="docs"

        echo "    Generating docs for $COMP_NAME..."
        echo "      Creating docs for $COMP_NAME..."
        npx vue-docgen "$COMP_VUE_PATH" "$DOCS_DIR"
        mv "$DOCS_DIR/components/$COMP_NAME/$COMP_MD_FILE" "$DOCS_DIR/components/$COMP_MD_FILE"
        rmdir "$DOCS_DIR/components/$COMP_NAME"
        echo "      Created."

        echo "      Adding link for $COMP_MD_FILE to $INDEX_FILE..."
        DESC_TEXT=$(grep -m 1 -A 1 "/\*\*" "$COMP_VUE_PATH" | tail -1 | cut -d' ' -f3-)
        COMP_MD_LINK="components/$COMP_MD_FILE"
        echo "- [$COMP_NAME]($COMP_MD_LINK) - $DESC_TEXT" >> "$INDEX_PATH"
        echo "      Added."

        echo "      Adding back links from $COMP_MD_FILE to $INDEX_FILE..."
        TMP_PATH="docs/components/$COMP_NAME.tmp"
        echo "[[FarmData2 Documentation]](../$INDEX_FILE)" > "$TMP_PATH"
        echo "" >> "$TMP_PATH"
        cat "docs/components/$COMP_MD_FILE" >> "$TMP_PATH"
        echo "" >> "$TMP_PATH"
        echo "[[FarmData2 Documentation]](../$INDEX_FILE)" >> "$TMP_PATH"
        mv -f "$TMP_PATH" "docs/components/$COMP_MD_FILE"
        echo "      Added."
        echo "    Generated."
    fi
done
echo "  Generated."

echo "  Generating docs for all libraries..."

echo "    Adding Library section to $INDEX_FILE..."
echo "## Library" >> "$INDEX_PATH"
echo "" >> "$INDEX_PATH"
echo "    Added."

safe_cd "$REPO_ROOT_DIR/library"
LIBS=$(ls -d -- */)
safe_cd "$REPO_ROOT_DIR"

for LIB in $LIBS; do
    LIB_NAME=$(echo "$LIB" | cut -d/ -f1)
    if [ "$LIB_NAME" != "cypress" ] && ([ "$TARGET" == "$LIB_NAME" ] || [ "$TARGET" == "all" ]); then
        LIB_JS_PATH="library/$LIB_NAME/$LIB_NAME.js"
        LIB_MD_FILE="$LIB_NAME.md"
        LIB_MD_PATH="docs/library/$LIB_MD_FILE"
        DOCS_DIR="docs"

        echo "      Generating docs for $LIB_NAME..."
        echo "        Creating docs for $LIB_NAME..."
        npx jsdoc2md "$LIB_JS_PATH" > "$LIB_MD_PATH"
        echo "        Created."

        echo "      Adding link for $LIB_MD_FILE to $INDEX_FILE..."
        DESC_TEXT=$(grep "@description" "$LIB_JS_PATH" | cut -d' ' -f4-)
        LIB_MD_LINK="library/$LIB_MD_FILE"
        echo "- [$LIB_NAME]($LIB_MD_LINK) - $DESC_TEXT" >> "$INDEX_PATH"
        echo "      Added."

        echo "      Adding back links from $LIB_MD_FILE to $INDEX_FILE..."
        TMP_PATH="docs/library/$LIB_NAME.tmp"
        echo "[[FarmData2 Documentation]](../$INDEX_FILE)" > "$TMP_PATH"
        echo "" >> "$TMP_PATH"
        cat "docs/library/$LIB_MD_FILE" >> "$TMP_PATH"
        echo "" >> "$TMP_PATH"
        echo "[[FarmData2 Documentation]](../$INDEX_FILE)" >> "$TMP_PATH"
        mv -f "$TMP_PATH" "docs/library/$LIB_MD_FILE"
        echo "      Added."

        echo "    Generated."
    fi
done
echo "  Generated."

echo -e "${GREEN}Done.${NO_COLOR}"
