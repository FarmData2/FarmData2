#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

REPO_DIR=$(git rev-parse --show-toplevel)

# Launch the containers for postgres, farmos and the nginx reverse proxy for https.
cd "$REPO_DIR/docker"
docker compose up

# Install the sample database
"$REPO_DIR/bin/installDB.bash"

