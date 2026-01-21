#!/bin/bash

# Install some dependencies
sudo apt update
sudo apt install -y --no-install-recommends \
  build-essential \
  zip \
  jq

# Install the necessary versions of node and npm
# This will likely need to change if package.lock is updateed
source /usr/local/share/nvm/nvm.sh && nvm install 18.20.6
npm install -g npm@10.8.2

# Install the GitHub CLI tools so that we can
# interact with GitHub in scripts..
# Approach from:
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md
(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y

# Install shfmt - shell script formattter.
sudo curl -sS https://webinstall.dev/shfmt | bash
source ~/.config/envman/PATH.env

# Add project bin to the path
echo "" >> ~/.bashrc \
  && echo "export PATH=$PATH:/workspaces/FarmData2/bin" >> ~/.bashrc

# Setup git autocompletion
echo "" >> ~/.bashrc \
  && echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc

# Make sure that node will run with a self-signed certificate.
# This is fine for the dev container, but should not be used in production.
echo "" >> ~/.bashrc \
  && echo "export NODE_TLS_REJECT_UNAUTHORIZED='0'" >> ~/.bashrc

# Change the group for the /var/run/docker.sock file.
sudo chgrp docker /var/run/docker.sock

# Generate the self-signed SSL certificate.
# It will be valid for 25 years - codepsace is unlikely to live that long.
mkdir .devcontainer/ssl 2> /dev/null
openssl req -x509 -nodes -newkey rsa:2048 \
  -days 9125 \
  -keyout ".devcontainer/ssl/farmos.key" \
  -out ".devcontainer/ssl/farmos.crt" \
  -subj "/C=US/ST=Development/L=Development/O=FarmData2/OU=Development/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:farmos,IP:127.0.0.1"
chmod 644 ".devcontainer/ssl/farmos.crt"
chmod 600 ".devcontainer/ssl/farmos.key"

# Stuff to reduce image size.
sudo apt-get clean -y \
 && sudo apt-get autoclean -y \
 && sudo apt-get autoremove -y \
 && sudo rm -rf /var/lib/apt/lists/*

# Wait for noVNC, postgres and farmos

function waitForIt {
  SERVICE_NAME=$1
  CHECK_COMMAND=$2
  OK_RESULT=$3
  MAX_TRIES=$4
  TRIES=0

  echo "Waiting for $SERVICE_NAME "
  echo -n "."
  RESP=$(eval "$CHECK_COMMAND" | grep "$OK_RESULT")
  while [ "$RESP" == "" ] && [ $TRIES -lt $MAX_TRIES ]; do
    sleep 1
    echo -n "."
    RESP=$(eval "$CHECK_COMMAND" | grep "$OK_RESULT")
    ((TRIES++))
  done

  if [ "$RESP" == "" ]; then
    return 1
  else
    return 0
  fi
}


# docker exec fd2_postgres pg_isready
# /var/run/postgresql:5432 - accepting connections

# curl -Is localhost:6901
# HTTP/1.1 200 OK

# curl -fsIkv https://proxy
# * Connected to proxy (172.18.0.5) port 443 (#0)

# curl -fsIkv http://farmos
# * Connected to farmos (172.18.0.4) port 80 (#0)


# Display a message so we know everyting is done.
echo ""
echo "==============================================="
echo "The FarmData2 Development Environment is ready."
echo "Happy coding!"
echo "==============================================="
echo ""