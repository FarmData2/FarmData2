#!/bin/bash

source colors.bash
source lib.bash

# Ensure Node.js and npm are installed. I'm not sure if we need this but I just wanted to put it in.
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "Node.js or npm is not installed. Please install them first."
    exit 1
fi

# Setting Env Variables
PWD="$(pwd)" # Current Working Dir
SCRIPT_PATH=$(readlink -f "$0") # Script Path
SCRIPT_DIR=$(dirname "$SCRIPT_PATH") # Script Directory
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # Repository Root Directory

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

INDEX_FILE="FarmData2.md" 
INDEX_PATH="$REPO_ROOT_DIR/docs/$INDEX_FILE"

# Recreate the index file (Erases and rewrite into header upon regeneration)
echo "# FarmData2 Documentation" > "$INDEX_PATH"
echo "" >> "$INDEX_PATH"

update_docs() {
    local TYPE=$1 # components or library
    local NAME=$2
    local PATH="$REPO_ROOT_DIR/$TYPE/$NAME"
    local DOC_PATH="$TYPE/$NAME.md"
    local DESC_TEXT=""

    if [[ -d "$PATH" ]]; then
        echo "    Generating docs for $NAME..."
        # Use vue-docgen or jsdoc2md based on type
        if [ "$TYPE" == "components" ]; then
            DESC_TEXT=$(grep -m 1 -A 1 "<\!--" "$PATH/$NAME.vue" | tail -1 | cut -d' ' -f2-)
            (cd "$REPO_ROOT_DIR" && npx vue-docgen "$PATH/$NAME.vue" -o "$DOC_PATH")
        else
            DESC_TEXT=$(grep -m 1 "/**" "$PATH/$NAME.js" -A 2 | tail -1 | cut -d' ' -f2-)
            (cd "$REPO_ROOT_DIR" && npx jsdoc2md "$PATH/$NAME.js" > "$DOC_PATH")
        fi
        echo "      Docs generated for $NAME."

        # Adds link and description to the index file
        echo "- [$NAME]($DOC_PATH) - $DESC_TEXT" >> "$INDEX_PATH"
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
