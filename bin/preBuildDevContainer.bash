#!/bin/bash

# This script will build the dev container and optionally
# push it to DockerHub.  To push to docker hub it is necessary
# to be logged into dockerhub via docker as a farmdata2 admin.

function usage {
  echo "preBuildDevContainer.bash Usage:"
  echo "  -b | --build: Build but do not push the image."
  echo "  -p | --push: Push the most recently built image image to dockerhub."
  echo "          If --build is specified the built image is pushed."
  echo "          Otherwise push the previously built image if one exists."
  echo "          Note: Requires farmdata2 admin login for dockerhub."
  echo " -h | --help: Display this message."
  echo ""
  exit 255
}

REPO_DIR=$(git rev-parse --show-toplevel)
source "$REPO_DIR/bin/lib/checkServices.lib.bash"

if [ $# -lt 1 ]; then
  usage
fi

DOCKER_HUB_USER="farmdata2"
PLATFORMS=linux/amd64,linux/arm64

PUSH=0
BUILD=0

FLAGS=$(getopt -o bph \
  --long build,push,help \
  -- "$@" 2> /dev/null)

echo "flags: $FLAGS"

eval set -- "$FLAGS"

while true; do
  case $1 in
    -b | --build)
      BUILD=1
      shift
      ;;
    -p | --push)
      PUSH=1
      shift
      ;;
    -h | --help)
      usage
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "Unrecognized option: $1"
      usage
      ;;
  esac
done

checkDocker
DOCKER=$?
if ((!DOCKER)); then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Could not connect to the Docker daemon."
  echo ""
  echo "Try stopping and restarting the codespace."
  echo "If that does not work try creating a new one."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
  exit 1
fi

echo "PUSH: $PUSH"
echo "BUILD: $BUILD"

LOGGED_IN=0
# Only check the login if we are pushing the image.
if [ "$PUSH" = "1" ]; then
  # Check that the DockerHub user identified above is logged in.
  LOGGED_IN=$(docker system info | grep -E 'Username|Registry' | grep -c "$DOCKER_HUB_USER")

  if [ "$LOGGED_IN" = "0" ]; then
    echo "Please log into Docker Hub as $DOCKER_HUB_USER before prebuilding the devcontainer image."
    echo "  Use: docker login"
    echo "This allows multi architecture images to be pushed to dockerhub."
    exit 255
  fi
fi

echo "LOGGED_IN: $LOGGED_IN"
