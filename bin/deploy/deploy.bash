#!/bin/bash

# Get the directory of the FarmData2 repository.
REPO_DIR=$(git rev-parse --show-toplevel)

# Get the branch to deploy
BRANCH=${1:-"development"}

# Switch to the branch to deploy
cd "$REPO_DIR" || exit
git switch "$BRANCH"

# Ensure fd2dev owns the contents of the workspace directory.
echo "Setting fd2dev as owner of /home/fd2dev content..."
sudo chown -R fd2dev /home/fd2dev
echo "Ownership set."

# Installing FD2 Dependencies
echo "Installing dependencies..."
npm ci
echo "Installed."

# Build the FD2 modules.
echo "Building the FD2 modules..."
echo "  FarmData2..."
rm -rf "$REPO_DIR/modules/farm_fd2/dist" 2> /dev/null
mkdir "$REPO_DIR/modules/farm_fd2/dist"
npm run build:fd2 2> /dev/null
echo "  Examples..."
rm -rf "$REPO_DIR/modules/farm_fd2_examples/dist" 2> /dev/null
mkdir "$REPO_DIR/modules/farm_fd2_examples/dist"
npm run build:examples 2> /dev/null
echo "  School..."
rm -rf "$REPO_DIR/modules/farm_fd2_school/dist" 2> /dev/null
mkdir "$REPO_DIR/modules/farm_fd2_school/dist"
npm run build:school 2> /dev/null
echo "Built."

# Bring up FarmData2...
echo "Bringing up FarmData2..."
rm -drf "$REPO_DIR/docker/db" 2> /dev/null
mkdir "$REPO_DIR/docker/db"
cd "$REPO_DIR/docker" || exit
docker compose up --detach
echo "FarmData2 is up."

# Installing the sample Database
echo "Installing the sample database..."
cd "$REPO_DIR/bin" || exit
./installDB.bash
echo "Installed."

# Removing the examples and school modules.
echo "Uninstalling the examples and school modules..."
docker exec fd2_farmos drush pm-uninstall farm_fd2_examples -y
docker exec fd2_farmos drush pm-uninstall farm_fd2_school -y
docker exec fd2_farmos drush cr
echo "Uninstalled."

# Setup an SSL certificate using sslip.io and certbot.
echo "Setting up SSL certificate..."
rm -rf docker/ssl 2> /dev/null
mkdir docker/ssl 2> /dev/null
IP_ADDR=$(curl -s ifconfig.me | cut -f1 -d'f')
sudo certbot certonly --non-interactive --agree-tos --standalone --preferred-challenges http -d "$IP_ADDR.sslip.io"
sudo cp /etc/letsencrypt/live/"$IP_ADDR.sslip.io"/fullchain.pem "docker/ssl/farmos.crt"
sudo cp /etc/letsencrypt/live/"$IP_ADDR.sslip.io"/privkey.pem "docker/ssl/farmos.key"
sudo chown fd2dev:fd2dev "docker/ssl/farmos.crt"
sudo chown fd2dev:fd2dev "docker/ssl/farmos.key"
chmod 644 "docker/ssl/farmos.crt"
chmod 600 "docker/ssl/farmos.key"
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
docker restart fd2_nginx
echo "Setup."
