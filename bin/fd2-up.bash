#!/bin/bash

source ./lib.bash
source ./colors.bash

# Ensuring this script is not being run as root.
RUNNING_AS_ROOT=$(id -un | grep "root")
if [ -n "$RUNNING_AS_ROOT" ]; then
  echo -e "${RED}ERROR:${NO_COLOR}The fd2-up.bash script should not be run as root."
  echo "Please run fd2-up.bash without using sudo."
  exit 255
fi

# Ensure that this script is not being run in the development container.
HOST=$(docker inspect -f '{{.Name}}' "$HOSTNAME" 2> /dev/null)
if [ "$HOST" == "/fd2_dev" ]; then
  echo -e "${RED}ERROR:${NO_COLOR} fd2-up.bash script cannot be run in the dev container."
  echo "Always run fd2-up.bash on your host OS."
  exit 255
fi

# Check that /var/run/docker.sock exists and then symlink it as
# ~/.contconf/docker.sock so that it can be mounted the same in WSL.
echo "Checking for docker.sock..."
SYS_DOCKER_SOCK=$(ls /var/run/docker.sock 2> /dev/null)
if [ -z "$SYS_DOCKER_SOCK" ]; then
  echo -e "  ${RED}ERROR:${NO_COLOR} /var/run/docker.sock not found."
  echo "  Ensure that Docker Desktop is installed and running."
  echo "  Also ensure that the 'Allow the default Docker socket to be used'"
  echo "  setting in Docker Desktop -> Settings -> Advanced is enabled."
  exit 255
fi

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.
safe_cd "$REPO_ROOT_DIR"

echo -e "${UNDERLINE_BLUE}Starting FarmData2 development environment...${NO_COLOR}"

# Get the name of the directory containing the FarmData2 repo.
# This is the FarmData2 directory by default, but may have been
# changed by the user.
FD2_PATH=$(pwd)
FD2_DIR=$(basename "$FD2_PATH")
safe_cd docker

echo "Starting development environment from $FD2_DIR."
echo "  Full path: $FD2_PATH"

# (Re)create the .fd2 directory.
# This directory is used for development environment configuration information.
# It is recreated on each start.
echo "Creating the ~/.fd2 configuration directory."
rm -fr ~/.fd2 2> /dev/null
mkdir ~/.fd2
echo "  The ~/.fd2 configuration directory created."

# Determine the host operating system.
echo "Detecting host Operating System..."
OS=$(uname -a)
PROFILE=
if [[ "$OS" == *"Darwin"* ]]; then
  PROFILE=macos
elif [[ "$OS" == *"microsoft"* ]] || [[ "$OS" == *"Microsoft"* ]]; then
  # Note that this is before Linux because if running in WSL
  # uname -a reports Linux, but also has microsoft later in the output.
  PROFILE=wsl
elif [[ "$OS" == *"Linux"* ]]; then
  PROFILE=linux
else
  echo -e "${RED}ERROR:${NO_COLOR} Your host operating system $OS was not recognized."
  echo "  Please file an issue on the FarmData2 issue tracker."
  exit 255
fi
echo "  Running on a $PROFILE host."

if [[ "$PROFILE" == "macos" ]]; then
  echo "Running fd2-up.macos.bash..."
  source "$SCRIPT_DIR/fd2-up.macos.bash"
  echo "fd2-up.macos.bash done."
else
  echo "Running fd2-up.linux.bash..."
  source "$SCRIPT_DIR/fd2-up.linux.bash"
  echo "fd2-up.linux.bash done."
fi

# Delete any of the existing containers.
echo "Removing any stale containers..."
docker rm fd2_postgres &> /dev/null
docker rm fd2_farmos &> /dev/null
docker rm fd2_dev &> /dev/null

echo "Starting containers..."
# Note: Any command line args are passed to the docker-compose up command
docker compose up -d "$@"

echo "Rebuilding the drupal cache..."
sleep 3 # give site time to come up before clearing the cache.
docker exec -it fd2_farmos drush cr

echo "Waiting for fd2dev container configuration and startup..."
NO_VNC_RESP=$(curl -Is localhost:6901 | grep "HTTP/1.1 200 OK")
if [ "$NO_VNC_RESP" == "" ]; then
  echo -n "  This may take a few moments: "
  wait_for_novnc
  echo ""
fi
echo "  fd2dev container configured and ready."

echo -e "${UNDERLINE_BLUE}FarmData2 development environment started${NO_COLOR}"
