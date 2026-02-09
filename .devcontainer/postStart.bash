#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

echo "Starting the documentation server..."
setsid --fork npm run docs:view > /dev/null 2> /dev/null
echo "Started."
