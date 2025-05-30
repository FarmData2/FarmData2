#!/bin/bash

# Get the branch to deploy
BRANCH=${1:-"development"}

# Switch to the branch to deploy
cd ~/FarmData2 || exit
git switch "$BRANCH"

# Installing FD2 Dependencies
echo "Installing dependencies..."
npm ci
echo "Installed."

# Starting FD2
echo "Starting FD2..."
cd bin || exit
./fd2-up.bash
echo "Started."

# Build the FD2 modules.
echo "Building the FD2 modules..."
echo "  FarmData2..."
npm run build:fd2 > /dev/null 2>&1
echo "  Examples..."
npm run build:examples > /dev/null 2>&1
echo "  School..."
npm run build:school > /dev/null 2>&1
echo "Built."

