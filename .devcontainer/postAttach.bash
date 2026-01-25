#!/bin/bash

# This runs each time the project folder is opened in VSCode.
# E.g. on a browser window reload or opening a new window to a running container.


source bin/lib/checkServers.lib.bash

# Wait until postgres, noVNC, farmOS and nginx have started and 
# display a message for the user.
checkAllServers
if [ $? == 0 ];
then
  echo ""
  echo "==============================================="
  echo "The FarmData2 Development Environment is ready."
  echo "Happy coding!"
  echo "==============================================="
  echo ""
else
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "One or more of the servers has not started."
  echo "Try restarting the codespace or creating a new one."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi