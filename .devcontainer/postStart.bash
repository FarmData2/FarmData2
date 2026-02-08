#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

REPO_DIR=$(git rev-parse --show-toplevel)
source "$REPO_DIR"/bin/lib/checkServices.lib.bash

# Start the documentation server.
echo "Starting the documentation server..."
setsid --fork npm run docs:view > /dev/null 2> /dev/null
echo "Started."
