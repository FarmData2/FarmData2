#!/bin/bash

echo "fd2dev" | sudo -S ls &> /dev/null

sudo apt update
sudo apt install -y --no-install-recommends \
  ncat

sudo apt clean
