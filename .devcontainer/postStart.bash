#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

# The group on docker.sock is not preserved across 
# devcontainer restarts so set it here so it happens
# every time a new container is created.
echo "Setting group for docker.sock..."
sudo chgrp docker /var/run/docker.sock
echo "Group set."
