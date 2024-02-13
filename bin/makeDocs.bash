#!/bin/bash

source colors.bash
source lib.bash

# Setting Environment Variables with unique names to avoid overwriting system PATH
CURRENT_WORKING_DIR="$(pwd)"
ABSOLUTE_SCRIPT_PATH=$(readlink -f "$0")
SCRIPT_DIR_PATH=$(dirname "$ABSOLUTE_SCRIPT_PATH")
REPOSITORY_ROOT_DIR=$(builtin cd "$SCRIPT_DIR_PATH/.." && pwd)

TARGETS=()

usage() {
    echo "Usage: $0 [options...]"
    echo "Options:"
    echo "  --target <target_name>    Specify a target for documentation generation."
    echo "  --list-targets            List all valid targets for documentation."
    echo "  --help                    Show this help message and exit."
    echo ""
    echo "If no targets are specified, documentation for all components and libraries will be generated."
}

list_targets() {
    echo "Valid targets:"
    echo "  Components:"
    for COMPONENT in $(ls -d -- $REPOSITORY_ROOT_DIR/components/*/); do
        echo "    - $(basename "$COMPONENT")"
    done
    echo "  Library:"
    for LIBRARY in $(ls -d -- $REPOSITORY_ROOT_DIR/library/*/); do
        echo "    - $(basename "$LIBRARY")"
    done
}

# Parsing all command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --target) TARGETS+=("$2"); shift ;;
        --list-targets) list_targets; exit 0 ;;
        --help) usage; exit 0 ;;
        *) echo "Unknown parameter passed: $1"; usage; exit 1 ;;
    esac
    shift
done

# Default to generating all documentation if no targets are specified
if [ ${#TARGETS[@]} -eq 0 ]; then
    TARGETS=("all")
fi

INDEX_FILENAME="FarmData2.md"
INDEX_FILEPATH="$REPOSITORY_ROOT_DIR/$INDEX_FILENAME"

# Recreate the index file (Erases and rewrite into header upon regeneration)
echo "# FarmData2 Documentation" > "$INDEX_FILEPATH"
echo "" >> "$INDEX_FILEPATH"

update_docs() {
    local DOCTYPE=$1
    local DOCNAME=$2
    local DOCPATH="$REPOSITORY_ROOT_DIR/$DOCTYPE/$DOCNAME"
    local DOCFILE_PATH="$DOCTYPE/$DOCNAME.md"

    if [[ -d "$DOCPATH" ]]; then
        echo "    Generating docs for $DOCNAME..."
        if [ "$DOCTYPE" == "components" ]; then
            (cd "$REPOSITORY_ROOT_DIR" && npx vue-docgen "$DOCPATH/$DOCNAME.vue" -o "$DOCFILE_PATH")
        else
            (cd "$REPOSITORY_ROOT_DIR" && npx jsdoc2md "$DOCPATH/$DOCNAME.js" > "$DOCFILE_PATH")
        fi
        echo "      Docs generated for $DOCNAME."
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
