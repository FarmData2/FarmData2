#!/bin/bash

# This runs each time the project folder is opened in VSCode.
# E.g. on a browser window reload or opening a new window to a running container.

REPO_DIR=$(git rev-parse --show-toplevel)
source "$REPO_DIR"/bin/lib/checkServices.lib.bash

# Sometimes on restart we can't connect to the Docker daemon right away.
# So wait here for it to become available.
if ! checkDocker; then
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Could not connect to the Docker daemon."
  echo "Try restarting the codespace or creating a new one."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
  exit 1
fi

# Wait until postgres, noVNC, farmOS+nginx have started.
if ! checkAllServers; then
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "One or more of the FarmData2 servers has not started."
  echo ""
  echo "Try:"
  echo "  cd docker"
  echo "  docker compose down"
  echo "  docker comppse up"
  echo ""
  echo "Check for the fd2_postgres, fd2_farmos & fd2_nginx services:"
  echo "  docker ps"
  echo ""
  echo "If a service is missing try starting it:"
  echo "  docker start fd2_postgres"
  echo "  docker start fd2_farmos"
  echo "  docker start fd2_nginx"
  echo ""
  echo "Try restarting the codespace."
  echo "As a last resort create a new codespace."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
  exit 1
fi

# Print out links here so that VSCode picks them up and exposes the ports.
PROXY_PORT=$(docker port fd2_nginx | cut -d':' -f2 | head -1)
echo ""
echo "==============================================="
echo "The FarmData2 Development Environment is ready."
echo ""
echo "The following are available in the PORTS tab:"
echo "    farmOS: https://localhost:${PROXY_PORT}"
echo "     noVNC: http://localhost:6901"
echo "  FD2 Docs: http://localhost:8082"
echo "" 
echo "Happy coding!"
echo "==============================================="
echo ""
