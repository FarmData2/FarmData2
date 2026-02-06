#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

REPO_DIR=$(git rev-parse --show-toplevel)
source "$REPO_DIR"/bin/lib/checkServices.lib.bash

# Start the documentation server.
setsid --fork npm run docs:view

READY=$(checkDocs)
if ! "$READY"; then
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "The FarmData2 documentation server did not start."
  echo "It can be started manually with: npm run docs:view"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi