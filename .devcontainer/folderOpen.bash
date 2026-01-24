#!/bin/bash

# This runs each time the project folder is opened in VSCode.
# E.g. on a browser window reload or opening a new window to a running container.


# Wait until postgres, noVNC, farmOS and nginx have started and 
# display a message for the user.
source .devcontainer/checkServers.lib.bash
checkAllServers
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