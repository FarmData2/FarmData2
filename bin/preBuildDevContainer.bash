#!/bin/bash

# This script will build the dev container and optionally
# push it to DockerHub.  To push to docker hub it is necessary
# to be logged into dockerhub via docker as a farmdata2 admin.

function usage {
  echo ""
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

TAG="fd2.14"
DOCKER_HUB_USER="farmdata2"
#PLATFORMS=linux/amd64,linux/arm64
PLATFORMS=linux/amd64
#PLATFORMS=linux/arm64

DEVCONTAINER_PATH=./.devcontainer/devcontainer.json

PUSH=0
BUILD=0
FLAGS=$(getopt -o bph \
  --long build,push,help \
  -- "$@" 2> /dev/null)
if [ $? -ne 0 ]; then
  echo "Error: Invalid options provided."
  usage
fi

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

if [ "$BUILD" = "1" ]; then
  echo "Building dev container image for platforms: $PLATFORMS"

  # Create the builder if it doesn't exist.
  FD2_BUILDER=$(docker buildx ls | grep -c "^fd2builder")
  if [ "$FD2_BUILDER" = "0" ]; then
    echo "Making new builder for FarmData2 images."
    docker buildx create \
      --name fd2builder \
      --driver=docker-container
  fi

  # Switch to use the fd2builder.
  echo "Using the fd2builder."
  docker buildx use fd2builder

devcontainer build \
  --workspace-folder "$REPO_DIR" \
  --config $DEVCONTAINER_PATH \
  --image-name $DOCKER_HUB_USER/fd2dev:$TAG \
  --platform "$PLATFORMS" \
  --push false
fi

# Only check the login if we are pushing the image.
if [ "$PUSH" = "1" ]; then
  # Check that the DockerHub user identified above is logged in.
  LOGGED_IN=$(docker system info | grep -E 'Username|Registry' | grep -c "$DOCKER_HUB_USER")

  if [ "$LOGGED_IN" = "0" ]; then
    echo "Please log into Docker Hub as $DOCKER_HUB_USER before prebuilding the devcontainer image."
    echo "  Use: docker login --username $DOCKER_HUB_USER"
    echo "       Then run this script again."
    echo "       This allows multi architecture images to be pushed to dockerhub."
    echo "       Note: Password will not be displayed as it is typed."
    exit 255
  fi

  docker push $DOCKER_HUB_USER/fd2dev:$TAG
fi
