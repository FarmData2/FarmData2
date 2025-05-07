#!/bin/bash

# This script will deploy the development branch on a server 
# (E.g. DigitalOcean, etc).  The server must have git, docker
# and npm installed.
#
# The purpose of the script is to deploy an instance for testing.
# This is not the recommended way to deploy for production use.

# Define some useful variables, import libraries
source colors.bash
source lib.bash

SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.
safe_cd "$REPO_ROOT_DIR"

safe_cd "$REPO_ROOT_DIR"

echo -e "${UNDERLINE_BLUE}Deploying FarmData2 development branch...${NO_COLOR}"

# Ensuring this script is not being run as root.
RUNNING_AS_ROOT=$(id -un | grep "root")
if [ -n "$RUNNING_AS_ROOT" ]; then
  echo -e "${RED}ERROR:${NO_COLOR}The deploy-dev.bash script should not be run as root."
  echo "Please run deploy-dev.bash without using sudo."
  exit 255
fi

# Ensure that this script is not being run in the development container.
HOST=$(docker inspect -f '{{.Name}}' "$HOSTNAME" 2> /dev/null)
if [ "$HOST" == "/fd2_dev" ]; then
  echo -e "${RED}ERROR:${NO_COLOR} deploy-dev.bash script cannot be run in the dev container."
  echo "Always run deploy-dev.bash on the host."
  exit 255
fi


TODO:

- clone FD2
  - git clone https://github.com/FarmData2/FarmData2.git
  
- Enable firewall (https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu)
  - ufw allow OpenSSH
  - echo "y" | ufw enable

- Install Docker (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04)
  - sudo apt update
  - sudo apt install apt-transport-https ca-certificates curl software-properties-common
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  - echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  - sudo apt update
  - apt-cache policy docker-ce
  - sudo apt install docker-ce
  - sudo usermod -aG docker fd2

- Install npm
  - sudo apt update
  - sudo apt install nodejs
  - sudo apt install npm

- Install gh (https://github.com/cli/cli/blob/trunk/docs/install_linux.md)

(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
	&& sudo mkdir -p -m 755 /etc/apt/keyrings \
        && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        && cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y

- Create non root user
  - useradd -m -g sudo -g docker -p $FD2_PWD fd2dev
  - su - fd2dev

- Install Docker Compose (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04)
  - mkdir -p ~/.docker/cli-plugins/
  - curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
  - chmod +x ~/.docker/cli-plugins/docker-compose

- launch
  - cd FarmData2/bin
  - ./setup.bash
  - ./fd2-up.bash
  - ./fd2-up.bash




# Check for docker and npm dependencies
echo "  Checking system dependencies..."
DOCKER=$(which docker)
NPM=$(which npm)
if [ ! "$DOCKER" ]; then
  # INSTALL DOCKER
  echo "    Docker must be installed to run deploy-dev.bash"
fi
if [ ! "$NPM" ]; then
  echo "    npm must be installed to run deploy-dev.bash"
fi
if [ ! "$DOCKER" ] || [ ! "$NPM" ]; then
  exit 255
fi
echo "  Dependencies met."






# Update the development branch from origin
echo "  Updating development branch..."
git switch --quiet development
#git pull --quiet origin development
error_check "  Failed to update development branch."
echo "  Updated."

# Install npm dependencies
echo "  Installing project dependencies..."
npm ci --omit dev > /dev/null
echo "  Installed."

# Bring up farmOS and postgres
echo "Removing any stale containers..."
docker rm fd2_postgres &> /dev/null
docker rm fd2_farmos &> /dev/null

echo "Starting containers..."
safe_cd "$REPO_ROOT_DIR/docker"

# Note: Any command line args are passed to the docker compose up command
docker compose up -d "$@"

# Build the FD2 module
echo "  Building farm_fd2 module..."
npm run build:fd2 &> /dev/null
echo "  Built."

# Install the sample DB
echo "  Installing the sample database..."
bin/installDB.bash > /dev/null
echo "  Installed."

# Remove the FD2 Examples and School modules.
echo "  Uninstalling the FD2 Examples module..."
docker exec fd2_farmos drush pm-uninstall farm_fd2_examples -y
error_check "Unable to uninstall the examples module."
echo "  Uninstalled."
echo "  Uninstalling the FD2 School module..."
s drush pm-uninstall farm_fd2_school -y
error_check "Unable to uninstall the school module."
echo "  Uninstalled"

echo "  Clearing the Drupal cache..."
docker exec fd2_farmos drush cr
error_check "Unable to clear the cache."
echo "  Drupal cache cleared."

# Prompt for new default passwords and change them.
