#!/bin/bash

# Removes all block JavaScript and HTML comments from an 
# App.vue  or *.js file.  It leaves extra blank lines in
# many places, but eventually prettier will fix that.

# This script is intended for use only with the App.vue and 
# lib.js files in these templates. It will not handle more 
# general cases well.

# Remove JavaScript block comments.
NO_JS=$(sed -r ':a; s%(.*)/\*.*\*/%\1%; ta; /\/\*/ !b; N; ba' "$1")

# Remove HTML block comments.
NO_COMMENTS=$(echo "$NO_JS" | sed -r ':a; s%(.*)<!--.*-->%\1%; ta; /<!--/ !b; N; ba')

echo "$NO_COMMENTS" > "$1"

