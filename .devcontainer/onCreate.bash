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
source /usr/local/share/nvm/nvm.sh && nvm install 18.20.6
npm install -g npm@10.8.2
echo "Node version set"

# Make sure that node will run with a self-signed certificate.
# This is fine for the dev container, but should not be used in production.
echo "Configure node for self-signed certificates..."
echo "" >> ~/.bashrc \
  && echo "export NODE_TLS_REJECT_UNAUTHORIZED='0'" >> ~/.bashrc
echo "Node configured."

# Install the GitHub CLI tools so that we can
# interact with GitHub in scripts..
# Approach from:
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md
echo "Installing GitHub CLI..."
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y
echo "GitHub CLI installed."

echo "Setting up git autocompletion..."
echo "" >> ~/.bashrc \
  && echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc
echo "Git autocompletion setup."

echo "Installing shell script formatter shfmt..."
sudo curl -sS https://webinstall.dev/shfmt | bash
source ~/.config/envman/PATH.env
echo "shfmt installed."

# Generate the self-signed SSL certificate.
# It will be valid for 25 years - codepsace is unlikely to live that long.
echo "Generating self-signed SSL certificate..."
mkdir .devcontainer/ssl 2> /dev/null
openssl req -x509 -nodes -newkey rsa:2048 \
  -days 9125 \
  -keyout ".devcontainer/ssl/farmos.key" \
  -out ".devcontainer/ssl/farmos.crt" \
  -subj "/C=US/ST=Development/L=Development/O=FarmData2/OU=Development/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:farmos,IP:127.0.0.1"
chmod 644 ".devcontainer/ssl/farmos.crt"
chmod 600 ".devcontainer/ssl/farmos.key"
echo "SSL certificate generated."