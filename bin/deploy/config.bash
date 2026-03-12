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
# Create a non-root user with UID that matches the UID of
# the postgres user in the fd2_postgres container.  This
# ensure proper permissions to the mounted docker/db directory.
echo "Creating non-root user..."
USERNAME=fd2dev
USER_UID=999
USER_GID=1001

groupadd --gid $USER_GID $USERNAME
useradd --uid $USER_UID --gid $USER_GID -s /bin/bash -m $USERNAME
echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME
chmod 0440 /etc/sudoers.d/$USERNAME
usermod -aG docker $USERNAME
passwd -l $USERNAME # Disable login
echo "$USERNAME:$USERNAME" | chpasswd
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

# Install node and npm.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install 18.20.6

# Install the GitHub CLI.
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" |