#!/bin/bash

source colors.bash
source lib.bash

# Setting Environment Variables with unique names to avoid overwriting system PATH
CURRENT_WORKING_DIR="$(pwd)"
ABSOLUTE_SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR_PATH=$(dirname "$ABSOLUTE_SCRIPT_PATH")
REPOSITORY_ROOT_DIR=$(builtin cd "$SCRIPT_DIR_PATH/.." && pwd)

TARGETS=()

# Parsing all command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --target) TARGETS+=("$2"); shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Default to generating all documentation if no targets are specified
if [ ${#TARGETS[@]} -eq 0 ]; then
    TARGETS=("all")
fi

INDEX_FILENAME="FarmData2.md"
INDEX_FILEPATH="$REPOSITORY_ROOT_DIR/docs/$INDEX_FILENAME"

# Recreate the index file (Erases and rewrite into header upon regeneration)
echo "# FarmData2 Documentation" > "$INDEX_FILEPATH"
echo "" >> "$INDEX_FILEPATH"

update_docs() {
    local DOCTYPE=$1 # components or library
    local DOCNAME=$2
    local DOCPATH="$REPOSITORY_ROOT_DIR/$DOCTYPE/$DOCNAME"
    local DOCFILE_PATH="$DOCTYPE/$DOCNAME.md"

    if [[ -d "$DOCPATH" ]]; then
        echo "    Generating docs for $DOCNAME..."
        # Use vue-docgen or jsdoc2md based on type
        if [ "$DOCTYPE" == "components" ]; then
            (cd "$REPOSITORY_ROOT_DIR" && npx vue-docgen "$DOCPATH/$DOCNAME.vue" -o "$DOCFILE_PATH")
        else
            (cd "$REPOSITORY_ROOT_DIR" && npx jsdoc2md "$DOCPATH/$DOCNAME.js" > "$DOCFILE_PATH")
        fi
        echo "      Docs generated for $DOCNAME."

        # Adds link to the index file
        echo "- [$DOCNAME]($DOCFILE_PATH)" >> "$INDEX_FILEPATH"
    else
        echo "      $DOCTYPE $DOCNAME not found."
    fi
}

echo "## Components" >> "$INDEX_FILEPATH"
echo "" >> "$INDEX_FILEPATH"

for COMPONENT in $(ls -d -- $REPOSITORY_ROOT_DIR/components/*/); do
    COMPONENT_NAME=$(basename "$COMPONENT")
    if [[ " ${TARGETS[@]} " =~ " ${COMPONENT_NAME} " ]] || [[ " ${TARGETS[@]} " =~ " all " ]]; then
        update_docs "components" "$COMPONENT_NAME"
    fi
done

echo "## Library" >> "$INDEX_FILEPATH"
echo "" >> "$INDEX_FILEPATH"

for LIBRARY in $(ls -d -- $REPOSITORY_ROOT_DIR/library/*/); do
    LIBRARY_NAME=$(basename "$LIBRARY")
    if [[ " ${TARGETS[@]} " =~ " ${LIBRARY_NAME} " ]] || [[ " ${TARGETS[@]} " =~ " all " ]]; then
        update_docs "library" "$LIBRARY_NAME"
    fi
done

echo -e "${GREEN}Done.${NO_COLOR}"
