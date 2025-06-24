#!/bin/bash

# Disable check that generated a warning in the GitHub CLI install script.
# shellcheck disable=SC2174

# This script will deploy the a branch (defaults to development)
# of FarmData2 to a Droplet on Digital Ocean.

# Enable the firewall
echo "Configuring the firewall..."
apt update
apt install ufw -y
ufw allow OpenSSH
echo "y" | ufw enable
echo "Configured."

# Install Docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-debian-10
echo "Installing Docker..."
apt update
apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common -y
curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" -y
sudo apt update
sudo apt install docker-ce -y
echo "Installed."

# Create and configure a non-root user.
echo "Creating non-root user..."
useradd -m -G sudo,docker fd2dev
passwd -l fd2dev # Disable login
echo "fd2dev:fd2dev" | chpasswd
echo "fd2dev ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
echo "Created."

# Install Docker Compose for the non-root user
echo "Installing Docker Compose..."
su - fd2dev << EOF
# Install Docker Compose 
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04
echo "Installing Docker Compose..."
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
EOF
echo "Installed."