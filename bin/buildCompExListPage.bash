#!/bin/bash

# This script rebuilds the component_examples entry point from the component 
# source code in the components directory.  This ensures that all of the components
# are listed and linked in the component_examples entry point.

# Get the path to the main repo directory.
PWD="$(pwd)"
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

INDEX_PAGE="$REPO_ROOT_DIR/modules/farm_fd2_examples/src/entrypoints/component_examples/App.vue"
# Remove the temporary files that we are using.
rm /var/tmp/App.vue 2> /dev/null
touch /var/tmp/App.vue

head -4 "$INDEX_PAGE" >> /var/tmp/App.vue

COMPONENTS=$(ls "$REPO_ROOT_DIR/components")
for COMPONENT in $COMPONENTS; do
  if [ "$COMPONENT" != "vite.config.js" ] && [ "$COMPONENT" != "components.d.ts" ]; then

    DESCRIPTION=$(grep "^ \*.*$COMPONENT" "$REPO_ROOT_DIR/components/$COMPONENT/$COMPONENT.vue" | head -1)
    DESCRIPTION=${DESCRIPTION:3}
    COMPONENT_ID=$(echo "$COMPONENT" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//')

    {
      echo "    <li>"
      echo "      <a href=\"$COMPONENT_ID\">$COMPONENT</a>: $DESCRIPTION"
      echo "    </li>"
    } >> /var/tmp/App.vue
  fi
done

tail -29 "$INDEX_PAGE" >> /var/tmp/App.vue

mv /var/tmp/App.vue "$INDEX_PAGE"

npm run build:examples &> /dev/null