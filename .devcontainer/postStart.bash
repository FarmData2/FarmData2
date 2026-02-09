#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

echo "Rewriting component example URLs in the documentation as needed..."
rewriteCompDocsExURL
echo "Rewritten."
echo ""

echo "Starting the documentation server..."
setsid --fork npm run docs:view > /dev/null 2> /dev/null
echo "Started."
