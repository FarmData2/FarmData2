#!/bin/bash

# Removes all block JavaScript and HTML comments from an 
# App.vue  or *.js file.
# This script is intended for use only with the App.vue and 
# lib.js files in these templates. It will not handle more 
# general cases well.

source lib.bash

# Get the path to the main repo directory.
FILE_DIR=$(pwd)
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then 
  echo "Usage: removeComments.bash <filename>" ]
  exit 1
fi

if [ "$#" -ne 1 ]; then 
  echo "Usage: removeComments.bash <filename>"
  exit 1
fi

FILENAME="$1"

if [ ! -f "$FILENAME" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} $FILENAME does not exist."
  echo "  This script should be run from the directory containing the file"
  echo "  from which the comments are to be removed."
  exit 255
fi

# Remove JavaScript block comments.
NO_JS=$(sed -r ':a; s%(.*)/\*[^\*].*\*/%\1%; ta; /\/\*/ !b; N; ba' "$FILENAME")

# Remove HTML block comments.
NO_COMMENTS=$(echo "$NO_JS" | sed -r ':a; s%(.*)<!--.*-->%\1%; ta; /<!--/ !b; N; ba')

echo "$NO_COMMENTS" > "$FILENAME"

# Reformat the file with prettier.
safe_cd "$REPO_ROOT_DIR"
npx prettier --write --loglevel silent "$FILE_DIR/$FILENAME"
