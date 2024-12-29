#!/bin/bash
# Take all of the containers down

# Ensure that this script is not being run in the development container.
HOST=$(docker inspect -f '{{.Name}}' "$HOSTNAME" 2> /dev/null)
if [ "$HOST" == "/fd2_dev" ]; then
  echo -e "${RED}ERROR:${NO_COLOR} The fd2-down.bash script should not be run in the fd2dev container"
  echo "Always run fd2-down.bash on your host OS."
  exit 255
fi

echo "Stopping and Removing Containers..."

# Get to the docker directory so compose.yml is available.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.
cd "$REPO_ROOT_DIR/docker" ||
  (
    echo -e "  ${RED}ERROR:${NO_COLOR} $REPO_ROOT_DIR/docker is missing."
    echo "  Restore this directory and try again."
    exit 255
  )

docker compose down

echo "Done."
