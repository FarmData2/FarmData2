#!/bin/bash

# Get the path to the main repo directory.
SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.

source "$SCRIPT_DIR/lib.bash"
source "$SCRIPT_DIR/colors.bash"

safe_cd "$REPO_ROOT_DIR"

echo -e "${UNDERLINE_BLUE}Starting FarmData2 development environment...${NO_COLOR}"

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

# Check that /var/run/docker.sock exists
echo "Checking for docker.sock..."
SYS_DOCKER_SOCK=$(ls /var/run/docker.sock 2> /dev/null)
if [ -z "$SYS_DOCKER_SOCK" ]; then
  echo -e "  ${RED}ERROR:${NO_COLOR} /var/run/docker.sock not found."
  echo "  Ensure that Docker Desktop is installed and running."
  echo "  Also ensure that the 'Allow the default Docker socket to be used'"
  echo "  setting in Docker Desktop -> Settings -> Advanced is enabled."
  exit 255
fi
echo "  Found it."

# Check if Docker daemon is running
echo "Checking if Docker daemon is running..."
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}ERROR:${NO_COLOR} Docker daemon is not running. Please start Docker and try again."
    exit 1
fi
echo "  Docker daemon is running."

# Get the name of the directory containing the FarmData2 repo.
# This is the FarmData2 directory by default, but may have been
# changed by the user.
FD2_PATH=$(pwd)
FD2_DIR=$(basename "$FD2_PATH")

echo "Starting development environment from $FD2_DIR."
echo "  Full path: $FD2_PATH"

# Create the .fd2 directory if it does not exist.
# This directory is used for development environment configuration information.
if [ ! -d ~/.fd2 ]; then
  echo "Creating the ~/.fd2 configuration directory."
  mkdir ~/.fd2
  echo "  The ~/.fd2 configuration directory created."
fi

# Create the dist directories if they do not exist
if [ ! -d "$FD2_PATH"/modules/farm_fd2/dist ]; then
  echo "Creating the modules/farm_fd2/dist directory."
  mkdir "$FD2_PATH"/modules/farm_fd2/dist
  echo "  Created."
fi
if [ ! -d "$FD2_PATH"/modules/farm_fd2_examples/dist ]; then
  echo "Creating the modules/farm_fd2_examples/dist directory."
  mkdir "$FD2_PATH"/modules/farm_fd2_examples/dist
  echo "  Created."
fi
if [ ! -d "$FD2_PATH"/modules/farm_fd2_school/dist ]; then
  echo "Creating the modules/farm_fd2_school/dist directory."
  mkdir "$FD2_PATH"/modules/farm_fd2_school/dist
  echo "  Created."
fi

# Determine the host on which we are running.
echo "Detecting host..."
GP="$(which gp)" # Check for GitPod which will have gp command.
OS=$(uname -a)   # Check for other OS's
PROFILE=
if [ "$GP" != "" ]; then
  PROFILE=gitpod
elif [[ "$OS" == *"Darwin"* ]]; then
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

if [[ "$PROFILE" == "gitpod" ]]; then
  echo "Running fd2-up.gitpod.bash..."
  source "$SCRIPT_DIR/fd2-up.gitpod.bash"
  echo "  Done."
elif [[ "$PROFILE" == "macos" ]]; then
  echo "Running fd2-up.macos.bash..."
  source "$SCRIPT_DIR/fd2-up.macos.bash"
  echo " Done."
else
  echo "Running fd2-up.linux.bash..."
  source "$SCRIPT_DIR/fd2-up.linux.bash"
  echo " Done."
fi

# Delete any of the existing containers.
echo "Removing any stale containers..."
docker rm fd2_postgres &> /dev/null
docker rm fd2_farmos &> /dev/null
docker rm fd2_dev &> /dev/null

echo "Starting containers..."
safe_cd "$FD2_PATH/docker"

# Note: Any command line args are passed to the docker compose up command
docker compose up -d "$@"

echo "Rebuilding the drupal cache..."
sleep 3 # give site time to come up before clearing the cache.
docker exec -it fd2_farmos drush cr &> /dev/null

echo "Waiting for fd2dev container configuration and startup..."
NO_VNC_RESP=$(curl -Is localhost:6901 | grep "HTTP/1.1 200 OK")
if [ "$NO_VNC_RESP" == "" ]; then
  echo -n "  This may take a few moments: "
  wait_for_novnc
  echo ""
fi
echo "  fd2dev container configured and ready."

echo -e "${UNDERLINE_BLUE}FarmData2 Development Environment started${NO_COLOR}"

echo ""
