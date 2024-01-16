#!/bin/bash

source colors.bash
source lib.bash

PWD="$(pwd)"
# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

TARGETS=()

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --target) TARGETS+=("$2"); shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

if [ ${#TARGETS[@]} -eq 0 ]; then
    TARGETS=("all")
    echo -e "${GREEN}Generating FarmData2 documentation for all components and libraries.${NO_COLOR}"
else
    echo -e "${GREEN}Generating documentation for specified targets.${NO_COLOR}"
fi

echo "  Creating or updating index file: $INDEX_FILE..."
INDEX_FILE="FarmData2.md"
INDEX_PATH="$REPO_ROOT_DIR/docs/$INDEX_FILE"
if [[ ! -f "$INDEX_PATH" ]]; then
    echo "# FarmData2 Documentation" > "$INDEX_PATH"
    echo "" >> "$INDEX_PATH"
fi
echo "  Updated."

echo "  Generating docs for all Components..."
echo "    Adding Components section to $INDEX_FILE..."
echo "## Components" >> "$INDEX_PATH"
echo "" >> "$INDEX_PATH"
echo "    Added."

safe_cd "$REPO_ROOT_DIR/components"
DIRS=$(ls -d -- */)
safe_cd "$REPO_ROOT_DIR"

update_component_docs() {
    local COMP_NAME=$1
    local COMP_VUE_PATH="components/$COMP_NAME/$COMP_NAME.vue"
    local COMP_MD_FILE="$COMP_NAME.md"
    local DOCS_DIR="docs/components"

    if [[ -f "$COMP_VUE_PATH" ]]; then
        echo "    Generating docs for $COMP_NAME..."
        npx vue-docgen "$COMP_VUE_PATH" "$DOCS_DIR"
        mv "$DOCS_DIR/$COMP_NAME/$COMP_MD_FILE" "$DOCS_DIR/$COMP_MD_FILE"
        rmdir "$DOCS_DIR/$COMP_NAME"
        echo "      Docs generated for $COMP_NAME."
    else
        echo "      Component $COMP_NAME not found."
    fi
}

# Function to update library documentation
update_library_docs() {
    local LIB_NAME=$1
    local LIB_JS_PATH="library/$LIB_NAME/$LIB_NAME.js"
    local LIB_MD_FILE="$LIB_NAME.md"
    local LIB_MD_PATH="docs/library/$LIB_MD_FILE"
    local DOCS_DIR="docs/library"

    if [[ -f "$LIB_JS_PATH" ]]; then
        echo "      Generating docs for $LIB_NAME..."
        npx jsdoc2md "$LIB_JS_PATH" > "$LIB_MD_PATH"
        echo "        Docs generated for $LIB_NAME."
    else
        echo "      Library $LIB_NAME not found."
    fi
}

for DIR in $DIRS; do
    COMP_NAME=$(echo "$DIR" | cut -d/ -f1)
    if [[ " ${TARGETS[@]} " =~ " ${COMP_NAME} " ]] || [[ " ${TARGETS[@]} " =~ " all " ]]; then
        update_component_docs "$COMP_NAME"
    fi
done
echo "  Components documentation generated."

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
    if [[ " ${TARGETS[@]} " =~ " ${LIB_NAME} " ]] || [[ " ${TARGETS[@]} " =~ " all " ]]; then
        update_library_docs "$LIB_NAME"
    fi
done
echo "  Libraries documentation generated."


echo -e "${GREEN}Done.${NO_COLOR}"
