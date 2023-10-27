#!/bin/bash
# shellcheck disable=SC1091  # Make sources okay.

source colors.bash
source lib.bash

# Define some useful variables, import libraries and
# check some common pre-conditions.
REPO_DIR=$(git rev-parse --show-toplevel)
DB_DIR="$REPO_DIR/docker/db"

if [ "$1" == "" ]; then
  # shellcheck disable=SC2207
  RELEASES=(
    $(gh release list \
      --exclude-drafts \
      --exclude-pre-releases \
      --repo FarmData2/FD2-SampleDBs |
      cut -f1)
  )

  echo "Choose the release to use..."
  select RELEASE in "${RELEASES[@]}"; do
    if (("$REPLY" <= 0 || "$REPLY" > "${#RELEASES[@]}")); then
      echo -e "${ON_RED}ERROR:${NO_COLOR} Invalid choice. Please try again."
    else
      break
    fi
  done
else
  RELEASE="$1"
fi

echo "Checking if release $RELEASE exists..."
REL_INFO=$(gh release view --repo FarmData2/FD2-SampleDBs "$RELEASE")
error_check "Unable to verify that release exists."
echo "  Release exists."

# shellcheck disable=SC2207
DBS=($(echo "$REL_INFO" | grep "asset:" | cut -f2))

if [ "$2" == "" ]; then
  echo "Choose which database asset from the release to use..."
  select DB in "${DBS[@]}"; do
    if (("$REPLY" <= 0 || "$REPLY" > "${#DBS[@]}")); then
      echo -e "${ON_RED}ERROR:${NO_COLOR} Invalid choice. Please try again."
    else
      break
    fi
  done
else
  DB=$2
fi

echo "Checking if database asset $DB exists in release $RELEASE..."
echo "$REL_INFO" | eval grep "$DB" > /dev/null
error_check "Unable to verify that database asset exists."
echo "  Database asset exists."

echo "Downloading database $DB from release $RELEASE..."
gh release download \
  --repo FarmData2/FD2-SampleDBs \
  --dir /var/tmp \
  --pattern "$DB" \
  --clobber
error_check "Unable to download the database."
echo "  Database downloaded."

echo -e "${UNDERLINE_GREEN}Installing the $DB database from release $RELEASE...${NO_COLOR}"
echo "Stopping farmOS..."
docker stop fd2_farmos > /dev/null
error_check "Error occurred stopping farmOS."
echo "  Stopped."

echo "Stopping Postgres..."
docker stop fd2_postgres > /dev/null
error_check "Error occurred stopping Postgres."
echo "  Stopped."

# # Make sure that the FarmData2/docker/db directory has appropriate permissions.
echo "Setting permissions on $REPO_DIR/docker/db..."
sudo chmod g+rwx "$REPO_DIR/docker/db"
error_check "Unable to set permissions."
sudo chgrp fd2dev "$REPO_DIR/docker/db"
error_check "Unable to change group."
echo "  Set."

safe_cd "$DB_DIR"

echo "Deleting current database..."
sudo rm -rf ./*
error_check "Unable to delete the current database."
echo "  Deleted."

echo "Extracting $DB..."
sudo tar -xzf "/var/tmp/$DB" > /dev/null
error_check "Error extracting the database."
echo "  Extracted."

###### DO WE NEED THIS HERE????
# echo "Removing farmOS tokens..."
# rm -rf "$REPO_DIR/scratch"
# echo "Removed."

echo "Restarting Postgres..."
docker start fd2_postgres > /dev/null
error_check "Error starting Postgres."
STATUS=$(docker exec fd2_postgres pg_isready)
while [[ ! "$STATUS" == *"accepting connections"* ]]; do
  STATUS=$(docker exec fd2_postgres pg_isready)
done
echo "  Started."

echo "Restarting farmOS..."
docker start fd2_farmos > /dev/null
error_check "Error starting farmOS."
echo "  Started."

echo "Clearing the Drupal cache..."
clearDrupalCache.bash
error_check "Unable to clear the cache."
echo "  Drupal cache cleared."

echo -e "${UNDERLINE_GREEN}Installed the $DB database from release $RELEASE...${NO_COLOR}"
