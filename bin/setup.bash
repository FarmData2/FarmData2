#!/bin/bash
# shellcheck disable=SC1091  # Make sources okay.

# Script that does much of the initial setup for the FD2 dev environment
# This script should only be run once when the dev environment is first setup.

# Define some useful variables, import libraries
source colors.bash
source lib.bash

SCRIPT_PATH=$(readlink -f "$0")                     # Path to this script.
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")                # Path to directory containing this script.
REPO_ROOT_DIR=$(builtin cd "$SCRIPT_DIR/.." && pwd) # REPO root directory.
safe_cd "$REPO_ROOT_DIR"

echo "Setting up the FarmData2 Development Environment..."
safe_cd "$REPO_ROOT_DIR"

echo "  Installing npm dependencies..."
npm ci > /dev/null
echo "  Installed."

echo ""

echo "  Setting up git hooks..."
safe_cd .git
rm -rf hooks
ln -s ../.githooks hooks
safe_cd ..
echo "  Set up."

echo ""

echo "  Installing VSCodium extensions..."
# Based on: https://stackoverflow.com/a/74440032
npx json5 .vscode/extensions.json \
  | npx json-cli-tool --path=recommendations --output=newline \
  | xargs -L 1 codium --force --install-extension
echo "  Installed."

echo ""

echo "  Configuring vale linter..."
if [ -f /usr/local/bin/vale ]; then
  # Remove existing vale if it is left over from an old fd2dev docker container.
  echo "fd2dev" | sudo -Sk -p "" rm /usr/local/bin/vale
fi
# Link to the version of vale installed by npm
if [ ! -f "$REPO_ROOT_DIR"/bin/vale ]; then
  echo "fd2dev" | sudo -Sk -p "" ln -s "$REPO_ROOT_DIR"/node_modules/@vvago/vale/bin/vale "$REPO_ROOT_DIR"/bin/vale
fi
vale sync
echo "  Configured."

echo "  Configuring git information..."
echo "    The following information will be associated with GitHub commits"
echo "    that you make from the FarmData2 development environment."
echo ""

CONFIRM="N"
GIT_USER=$(git config --global --list | grep user.name | cut -d"=" -f2)
GIT_EMAIL=$(git config --global --list | grep user.email | cut -d"=" -f2)
while [ "${CONFIRM,,}" != "y" ]; do

  if [ "$GIT_USER" = "" ]; then
    read -rp "    Name (user.name): " GIT_USER
  fi

  if [ "$GIT_EMAIL" = "" ]; then
    read -rp "    Email (user.email): " GIT_EMAIL
  fi

  echo ""
  echo "user.name=$GIT_USER"
  echo "user.email=$GIT_EMAIL"
  echo ""
  read -rp "    Is the above information correct? (Y/n) " CONFIRM

  if [ "$CONFIRM" = "N" ] || [ "$CONFIRM" = "n" ]; then
    GIT_USER=""
    GIT_EMAIL=""
  fi
done

git config --global user.name "$GIT_USER"
git config --global user.email "$GIT_EMAIL"
echo ""

UPSTREAM=$(git remote -v | grep "upstream.*https://github.com/FarmData2/FarmData2.git")
if [ "$UPSTREAM" = "" ]; then
  echo "    Setting the upstream remote..."
  git remote add upstream https://github.com/FarmData2/FarmData2.git
  echo "    Set."
fi

echo "  Configured."

echo ""

echo "  Authenticating with GitHub..."
if ! gh api user &> /dev/null; then
  echo "    The following will authenticate the FarmData2 development environment"
  echo "    with your GitHub account.  If you are not familiar with the options shown"
  echo "    the following are recommended as the easiest approach:"
  echo "      - What is your preferred protocol for Git operations on this host?"
  echo "        - HTTPS"
  echo "      - Authenticate Git with your GitHub credentials? (Y/n)"
  echo "        - Y"
  echo "      - How would you like to authenticate GitHub CLI?"
  echo "        - Login with a web browser"
  echo "          - Use your GitHub username and password to log in."
  echo ""

  while ! gh api user &> /dev/null; do
    if ! gh auth login --hostname GitHub.com; then
      echo "Authentication failed. Clearing credentials and trying again..."
      gh auth logout --hostname GitHub.com &> /dev/null
      read -rp "Press Enter to retry or Ctrl+C to exit..."
    fi
  done
fi
echo "  Authenticated."

echo ""

# Redirect both stdout and stderr to /dev/null because
# the sample database is not yet installed so these will
# generate errors, but they will still work as expected
# once the sample database is installed.
echo "  Building FarmData2 Drupal modules..."
echo "    Building farm_fd2..."
npm run build:fd2 &> /dev/null
echo "    Built."
echo "    Building farm_fd2_examples..."
npm run build:examples &> /dev/null
echo "    Built."
echo "    Building farm_fd2_school..."
npm run build:school &> /dev/null
echo "    Built."
echo "  Built."

echo ""

echo "  Building documentation..."
npm run docs:gen &> /dev/null
echo "  Documentation built."

echo "  Installing the sample database..."
bin/installDB.bash > /dev/null
echo "  Installed."

echo "Done."
