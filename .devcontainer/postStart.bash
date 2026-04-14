#!/bin/bash

# This runs every time the dev container starts.
# It makes non-persistent changes.

echo "Adding routes to docker containers to /etc/hosts..."
# Note the IP addresses are specified in /docker/compose.yml.
echo "172.20.0.2  db" | sudo tee -a /etc/hosts > /dev/null
echo "172.20.0.3  farmos" | sudo tee -a /etc/hosts > /dev/null
echo "172.20.0.4  proxy" | sudo tee -a /etc/hosts > /dev/null
echo "Added."

echo "Starting the documentation server..."
setsid --fork npm run docs:view > /dev/null 2> /dev/null
echo "Started."
