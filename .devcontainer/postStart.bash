#!/bin/bash

# The group on docker.sock was not preserved across 
# devcontainer restarts so set it here so it happens
# every time.
echo "Setting group for docker.sock..."
sudo chgrp docker /var/run/docker.sock
echo "Group set."



# Wait until postgres, noVNC, farmOS and nginx have started.
echo "Checking for FarmData2 Development Enviroment servers..."
source ../bin/waitForServers.lib.bash
waitForAll
if [ $? ];
then
  echo ""
  echo "==============================================="
  echo "The FarmData2 Development Environment is ready."
  echo "Happy coding!"
  echo "==============================================="
  echo ""
else
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "One or more of the servers has not started."
  echo "Try restarting or creating a new codespace."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi