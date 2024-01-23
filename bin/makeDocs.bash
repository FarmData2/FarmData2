#!/bin/bash

source colors.bash
source lib.bash


# Setting Env Variables
PWD="$(pwd)"
SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd)

TARGETS=()

# Parsing all command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --target) TARGETS+=("$2"); shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

INDEX_FILE="FarmData2.md"
INDEX_PATH="$REPO_ROOT_DIR/docs/$INDEX_FILE"

# Recreate the index file
echo "# FarmData2 Documentation" > "$INDEX_PATH"
echo "" >> "$INDEX_PATH"

update_docs() {
    local TYPE=$1 # components or library
    local NAME=$2
    local PATH="$REPO_ROOT_DIR/$TYPE/$NAME"
    local DOC_PATH="docs/$TYPE/$NAME.md"

    if [[ -d "$PATH" ]]; then
        echo "    Generating docs for $NAME..."
        # Use vue-docgen or jsdoc2md based on type
        if [ "$TYPE" == "components" ]; then
            npx vue-docgen "$PATH/$NAME.vue" -o "$REPO_ROOT_DIR/$DOC_PATH"
        else
            npx jsdoc2md "$PATH/$NAME.js" > "$REPO_ROOT_DIR/$DOC_PATH"
        fi
        echo "      Docs generated for $NAME."

        # Add link to the index file
        echo "- [$NAME]($DOC_PATH)" >> "$INDEX_PATH"
    else
        echo "      $TYPE $NAME not found."
    fi
}

echo "## Components" >> "$INDEX_PATH"
echo "" >> "$INDEX_PATH"

for COMPONENT in $(ls -d -- $REPO_ROOT_DIR/components/*/); do
    COMPONENT_NAME=$(basename "$COMPONENT")
    if [[ " ${TARGETS[@]} " =~ " ${COMPONENT_NAME} " ]] || [[ " ${TARGETS[@]} " =~ " all " ]]; then
        update_docs "components" "$COMPONENT_NAME"
    fi
done

echo "## Library" >> "$INDEX_PATH"
echo "" >> "$INDEX_PATH"

for LIBRARY in $(ls -d -- $REPO_ROOT_DIR/library/*/); do
    LIBRARY_NAME=$(basename "$LIBRARY")
    if [[ " ${TARGETS[@]} " =~ " ${LIBRARY_NAME} " ]] || [[ " ${TARGETS[@]} " =~ " all " ]]; then
        update_docs "library" "$LIBRARY_NAME"
    fi
done

echo -e "${GREEN}Done.${NO_COLOR}"
