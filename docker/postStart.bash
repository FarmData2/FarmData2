#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

# docker.sock only exists once it is mounted into
# the running container.  So need to do this after
# the container starts.
echo "Setting group for docker.sock..."
sudo chgrp docker /var/run/docker.sock
echo "Group set."
