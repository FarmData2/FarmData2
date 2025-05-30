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

# Build the FD2 modules.
echo "Building the FD2 modules..."
echo "  FarmData2..."
sg fd2grp "npm run build:fd2"
echo "  Examples..."
sg fd2grp "npm run build:examples"
echo "  School..."
sg fd2grp "npm run build:school"
echo "Built."

# Installing the sample Database
echo "Installing the sample database..."
./installDB.bash
echo "Installed."
