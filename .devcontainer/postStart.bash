#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

# Start the documentation server.
npm run docs:view &
