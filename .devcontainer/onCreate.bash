#!/bin/bash

# This runs once after the devcontainer is created.
# It adds content to to the container.

echo "Installing dependencies..."
sudo apt update
sudo apt install -y --no-install-recommends \
  build-essential \
  zip \
  jq

sudo apt-get clean -y \
 && sudo apt-get autoclean -y \
 && sudo apt-get autoremove -y \
 && sudo rm -rf /var/lib/apt/lists/*
echo "Dependencies installed."

# This will likely need to change if package.lock is updateed
echo "Setting the node version..."
sudo chown -R fd2dev /usr/local/share/nvm
sudo bash -c "source /usr/local/share/nvm/nvm.sh; \
     nvm install 18.20.6; \
     npm install -g npm@10.8.2"
echo "Node version set"

# Make sure that node will run with a self-signed certificate.
# This is fine for the dev container, but should not be used in production.
echo "Configure node for self-signed certificates..."
echo "" >> ~/.bashrc \
  && echo "export NODE_TLS_REJECT_UNAUTHORIZED='0'" >> ~/.bashrc
echo "Node configured."

echo "Setting up git autocompletion..."
echo "" >> ~/.bashrc \
  && echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc
echo "Git autocompletion setup."

echo "Installing shell script formatter shfmt..."
sudo curl -sS https://webinstall.dev/shfmt | bash
# shellcheck disable=SC1090
source ~/.config/envman/PATH.env
echo "shfmt installed."

