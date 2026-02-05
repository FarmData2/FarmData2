#!/bin/bash

# This runs each time the project folder is opened in VSCode.
# E.g. on a browser window reload or opening a new window to a running container.

# Print out links here so that VSCode picks them up and exposes the ports.
PROXY_PORT=$(docker port fd2_nginx | cut -d':' -f2 | head -1)
echo "Proxy is using: https://localhost:${PROXY_PORT}"
echo "noVNC is using: http://localhost:6901"

echo "All good to go!"
