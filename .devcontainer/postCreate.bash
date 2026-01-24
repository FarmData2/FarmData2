#!/bin/bash

# This runs once after the container is created and the source is available.
# This installs npm dependencies and builds the modules and docs.

echo "Adding FarmData2/bin to the PATH..."
echo "" >> ~/.bashrc \
  && echo "export PATH=$PATH:/workspaces/FarmData2/bin" >> ~/.bashrc
echo "FarmData2/bin added."