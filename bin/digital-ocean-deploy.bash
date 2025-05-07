#!/bin/bash

# This script will deploy either the development or production branch
# of FarmData2 to a Droplet on Digital Ocean.
# 
# Create a droplet with at least:
#   - Ubuntu
#   - Shared Basic CPU
#   - Regular SSD Disk
#   - 2GB RAM
#   - Select Password login and give a root password.
#
# Open the console using the DigitalOcean web interface or via CLI SSH


# Fetch the script with curl
# Run the script



# Enable the firewall
echo "Configuring the firewall..."
apt update
apt install ufw -y
ufw allow OpenSSH
echo "y" | ufw enable
echo "Configured."

# Install Docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04
#echo "Installing Docker..."
#curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
#echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
#apt update
#apt install apt-transport-https ca-certificates curl software-properties-common -y
#apt-cache policy docker-ce
#apt install docker-ce -y
#echo "Installed."

# Install Docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-debian-10
echo "Installing Docker..."
apt update
apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common -y
curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce -y
echo "Installed."

# Install node.js and npm
echo "Installing npm..."
apt install nodejs -y
apt install npm -y
echo "Installed."

# Install gh CLI 
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md
echo "Installing gh..."
(type -p wget >/dev/null || (apt update && apt-get install wget -y)) \
        && mkdir -p -m 755 /etc/apt/keyrings \
        && out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        && cat $out | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
        && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
        && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
        && apt update \
        && apt install gh -y
echo "Installed."

# Create and configure a non-root user.
echo "Creating non-root user..."
useradd -m -G sudo,docker fd2dev
echo -e "fd2dev\nfd2dev" | passwd fd2dev
passwd -l fd2dev
echo "Created."

echo "Switching to non-root user..."
su - fd2dev << EOF
# Install Docker Compose 
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04
echo "Installing Docker Compose..."
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
echo "Installed."

# Clone FD2
echo "Cloning FD2..."
cd ~
git clone https://github.com/FarmData2/FarmData2.git
echo "Cloned."

# Installing FD2 Dependencies
echo "Installing dependencies..."
cd FarmData2
npm ci
echo "Installed."

# Starting FD2
echo "Starting FD2..."
cd bin
./fd2-up.bash
echo "Started."

# Build the FD2 modules.
echo "Building the FD2 modules..."
npm run build:fd2 &> /dev/null
npm run build:examples &> /dev/null
npm run build:school &> /dev/null
echo "Built."
EOF


