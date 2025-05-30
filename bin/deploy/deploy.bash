#!/bin/bash

# Get the branch to deploy
BRANCH=${1:-"development"}

# Clone FD2
echo "Cloning FD2..."
git clone https://github.com/FarmData2/FarmData2.git
echo "Cloned."

# Switch to the branch to deploy
cd FarmData2 || exit
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
npm run build:fd2
echo "  Examples..."
npm run build:examples
echo "  School..."
npm run build:school
echo "Built."

