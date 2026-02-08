#!/bin/bash

# This runs once after the container is created and the source is available.
# This installs npm dependencies and builds the modules and docs.

# Reassign all of the workshpace files to the fd2dev user.
#sudo chown -R fd2dev:fd2dev /workspaces

REPO_DIR=$(git rev-parse --show-toplevel)
source "$REPO_DIR/bin/lib/checkServices.lib.bash"

# Generate the self-signed SSL certificate.
# It will be valid for 25 years - codepsace is unlikely to live that long.
echo "Generating self-signed SSL certificate..."
rm -rf docker/ssl 2> /dev/null
mkdir docker/ssl 2> /dev/null
openssl req -x509 -nodes -newkey rsa:2048 \
  -days 9125 \
  -keyout "docker/ssl/farmos.key" \
  -out "docker/ssl/farmos.crt" \
  -subj "/C=US/ST=Development/L=Development/O=FarmData2/OU=Development/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:farmos,IP:127.0.0.1"
chmod 644 "docker/ssl/farmos.crt"
chmod 600 "docker/ssl/farmos.key"
echo "SSL certificate generated."

echo "Adding FarmData2/bin to the PATH..."
echo "" >> ~/.bashrc \
  && echo "export PATH=$PATH:$REPO_DIR/bin" >> ~/.bashrc
echo "FarmData2/bin added."

echo "Installing npm dependencies..."
npm ci --no-fund --loglevel=error --quiet
echo "Installed."

echo "Configuring vale linter..."
ln -s "$REPO_DIR/node_modules/@vvago/vale/bin/vale" "$REPO_DIR/bin/vale"
"$REPO_DIR/bin/vale" sync
echo "Configured."

echo "Setting up git hooks..."
cd "$REPO_DIR/.git" || {
  echo " Error $REPO_DIR/.git directory does not exist."
  exit 1
}
rm -rf hooks
ln -s ../.githooks hooks
cd "$REPO_DIR" || {
  echo " Error $REPO_DIR does not exist."
  exit 1
}
echo "Set up."

# Note: Because the sample database is not yet installed
# these builds will generate errors, but they will still 
# work as expected once the sample database is installed.
echo "Building FarmData2 Drupal modules..."
echo "  Building farm_fd2..."
rm -rf "$REPO_DIR/modules/farm_fd2/dist"
mkdir "$REPO_DIR/modules/farm_fd2/dist"
npm run build:fd2
echo "  Built."
echo "  Building farm_fd2_examples..."
rm -rf "$REPO_DIR/modules/farm_fd2_examples/dist"
mkdir "$REPO_DIR/modules/farm_fd2_examples/dist"
npm run build:examples
echo "  Built."
echo "  Building farm_fd2_school..."
rm -rf "$REPO_DIR/modules/farm_fd2_school/dist"
mkdir "$REPO_DIR/modules/farm_fd2_school/dist"
npm run build:school
echo "  Built."
echo "All modules built."

echo "Building FarmData2 documentation..."
"$REPO_DIR/bin/makeDocs.bash"
echo "Documentation built."

# Launch the containers for postgres, farmos and the nginx reverse proxy for https.
cd "$REPO_DIR/docker" || {
  echo "Error docker directory does not exist."
  exit 1
}
docker compose up --detach

# Check that the minimum services to install the sample database are running.
checkPostgres; POSTGRES=$?
checkDrupal; DRUPAL=$?
READY=$(( POSTGRES && DRUPAL ))
if (( READY )); then
  echo "Installing the sample database..."
  "$REPO_DIR/bin/installDB.bash"
  echo "Sample database installed."
else
  echo ""
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "The postgres or farmOS container has not started."
  echo "The sample database cannot be installed at this time."
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo ""
fi
