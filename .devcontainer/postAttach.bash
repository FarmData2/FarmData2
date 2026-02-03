#!/bin/bash

# This runs each time the project folder is opened in VSCode.
# E.g. on a browser window reload or opening a new window to a running container.

source bin/lib/checkServers.lib.bash

# Print out links here so that VSCode picks them up and exposes the ports.
PROXY_PORT=$(docker port fd2_nginx | cut -d':' -f2 | head -1)
echo "https proxy is using: https://localhost:${PROXY_PORT}"
echo "noVNC is using: http://localhost:6901"

# Wait until postgres, noVNC, farmOS and nginx have started and 
# display a message for the user.
if checkAllServers
then
  echo ""
  echo "==============================================="
  echo "The FarmData2 Development Environment is ready."
  echo "Happy coding!"
  echo "==============================================="
  echo ""
else
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "One or more of the servers has not started."
  echo "Try restarting the codespace or creating a new one."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi

