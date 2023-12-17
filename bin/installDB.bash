#!/bin/bash
# shellcheck disable=SC1091  # Make sources okay.

source colors.bash
source lib.bash

function usage {
  echo "installDB.bash usage:"
  echo "  -h|--help : Display this message."
  echo ""
  echo "  The default behavior if no flags are provided is to install the"
  echo "  latest release of the sample database."
  echo ""
  echo "  -c|--current : Reinstall the most recently installed database."
  echo "    - The file /var/tmp/db.sample.tar.gz will be installed if it exists."
  echo "    - If /var/tmp/db.sample.tar.gz does not exist then the -p|--prompt behavior will be used."
  echo "    - No other flags may be specified with -c|--current."
  echo ""
  echo "  -p|--prompt : Prompt for the release and database artifact to install."
  echo "    - No other flags may be specified with -p|--prompt."
  echo ""
  echo "  -r<release>|--release=<release> : Specify the release to use."
  echo "    - E.g. --release=v2.0.1"
  echo "    - E.g. --release=v2.0.2.development.1"
  echo "    - Releases can be found at https://github.com/FarmData2/FD2-SampleDBs/releases"
  echo ""
  echo "    - If -r|--release is specified then a database asset may also be specified:"
  echo "      -a<asset>|--asset=<asset> : Asset from the release to install."
  echo "        - E.g. --asset=db.sample.tar.gz"
  echo "        - E.g. --asset=db.base.tar.gz"
  echo "        - Assets can be found at https://github.com/FarmData2/FD2-SampleDBs/releases"
  echo ""
  exit 255
}

# Define some useful variables, import libraries and
# check some common pre-conditions.
REPO_DIR=$(git rev-parse --show-toplevel)
DB_DIR="$REPO_DIR/docker/db"

echo "$#"

if [ "$#" == "0" ]; then
  LATEST=1
else

  # Process the command line flags
  FLAGS=$(getopt -o a::c::h::p::r:: \
    --long asset::,current::,help::,prompt::,release:: \
    -- "$@")
  error_check "Unrecognized option provided."
  eval set -- "$FLAGS"

  while true; do
    case $1 in
    -a | --asset)
      if [ "$2" == "" ]; then
        echo -e "${ON_RED}ERROR:${NO_COLOR} -a|--asset requires an argument."
        echo "Use installDB.bash --help for usage information"
        exit 255
      fi
      DB_ASSET=$2
      shift 2
      ;;
    -c | --current)
      CURRENT=1
      shift 2
      ;;
    -h | --help)
      usage
      ;;
    -p | --prompt)
      PROMPT=1
      shift 2
      ;;
    -r | --release)
      if [ "$2" == "" ]; then
        echo -e "${ON_RED}ERROR:${NO_COLOR} -r|--release requires an argument."
        echo "Use installDB.bash --help for usage information"
        exit 255
      fi
      DB_RELEASE=$2
      shift 2
      ;;
    --)
      shift
      break
      ;;
    *)
      usage
      ;;
    esac
  done
fi

if [ -n "$PROMPT" ]; then
  if [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ] || [ -n "$CURRENT" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -p|--prompt is specified, no other flags maybe included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi
fi

if [ -n "$CURRENT" ]; then
  if [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ] || [ -n "$PROMPT" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -c|--current is specified, no other flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  if [ ! -f "/var/tmp/db.sample.tar.gz" ]; then
    echo "/var/tmp/db.sample.tar.gz does not exist."
    echo "Defaulting to -p|--prompt behavior."
    unset CURRENT
    PROMPT=1
  fi
fi

if [ -n "$DB_ASSET" ]; then
  if [ -z "$DB_RELEASE" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -a|--asset is specified, the -r|--release flag must also be specified."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi
fi

# echo "Latest: $LATEST"
# echo "Current: $CURRENT"
# echo "Prompt: $PROMPT"
# echo "Release: $DB_RELEASE"
# echo "Asset: $DB_ASSET"

if [ -n "$CURRENT" ]; then
  DB_ASSET="db.sample.tar.gz"
elif [ -n "$DB_RELEASE" ] && [ -n "$DB_ASSET" ]; then
  # shellcheck disable=SC2207
  RELEASES=(
    $(gh release list \
      --repo FarmData2/FD2-SampleDBs |
      cut -f1)
  )
  # shellcheck disable=SC2207
  REL_INFO=$(gh release view --repo FarmData2/FD2-SampleDBs "$DB_RELEASE")

  echo "Checking if database asset $DB_ASSET exists in release $DB_RELEASE..."
  echo "$REL_INFO" | eval grep "$DB_ASSET" > /dev/null
  error_check "  Unable to verify that database asset exists in release."
  echo "  Database asset exists in release."
else
  if [ -n "$LATEST" ]; then
    # shellcheck disable=SC2207
    RELEASES=(
      $(gh release list \
        --exclude-drafts \
        --exclude-pre-releases \
        --repo FarmData2/FD2-SampleDBs |
        cut -f1)
    )

    DB_RELEASE="${RELEASES[0]}"
    DB_ASSET="db.sample.tar.gz"
  elif [ -n "$PROMPT" ]; then
    # shellcheck disable=SC2207
    RELEASES=(
      $(gh release list \
        --exclude-drafts \
        --exclude-pre-releases \
        --repo FarmData2/FD2-SampleDBs |
        cut -f1)
    )

    echo "Choose the release to use..."
    select DB_RELEASE in "${RELEASES[@]}"; do
      if (("$REPLY" <= 0 || "$REPLY" > "${#RELEASES[@]}")); then
        echo -e "${ON_RED}ERROR:${NO_COLOR} Invalid choice. Please try again."
      else
        break
      fi
    done

    # shellcheck disable=SC2207
    REL_INFO=$(gh release view --repo FarmData2/FD2-SampleDBs "$DB_RELEASE")
    # shellcheck disable=SC2207
    DBS=($(echo "$REL_INFO" | grep "asset:" | cut -f2))
    echo "Choose which database asset from the release to use..."
    select DB_ASSET in "${DBS[@]}"; do
      if (("$REPLY" <= 0 || "$REPLY" > "${#DBS[@]}")); then
        echo -e "${ON_RED}ERROR:${NO_COLOR} Invalid choice. Please try again."
      else
        break
      fi
    done
  fi
fi

if [ -n "$CURRENT" ]; then
  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from /var/tmp...${NO_COLOR}"
else
  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from release $DB_RELEASE...${NO_COLOR}"

  if [ -f "$DB_ASSET" ]; then
    echo "Deleting existing database archives..."
    rm /var/tmp/"$DB" 2 &> /dev/null
    error_check "Unable to delete existing database archives."
    echo "  Deleted."
  fi

  echo "Downloading database $DB_ASSET from release $DB_RELEASE..."
  gh release download \
    --repo FarmData2/FD2-SampleDBs \
    --dir /var/tmp \
    --pattern "$DB_ASSET" \
    --clobber
  error_check "Unable to download the database."
  echo "  Database downloaded."
fi

echo "Stopping farmOS..."
docker stop fd2_farmos > /dev/null
error_check "Error occurred stopping farmOS."
echo "  Stopped."

echo "Stopping Postgres..."
docker stop fd2_postgres > /dev/null
error_check "Error occurred stopping Postgres."
echo "  Stopped."

# Make sure that the FarmData2/docker/db directory has appropriate permissions.
echo "Setting permissions on $REPO_DIR/docker/db..."
echo "fd2dev" | sudo -Sk -p "" chgrp fd2grp "$REPO_DIR/docker/db"
error_check "Unable to change group."
echo "fd2dev" | sudo -Sk -p "" chmod g+rwx "$REPO_DIR/docker/db"
error_check "Unable to set permissions."

echo "  Set."

safe_cd "$DB_DIR"

echo "Deleting current database..."
echo "fd2dev" | sudo -Sk -p "" rm -rf ./*
error_check "Unable to delete the current database."
echo "  Deleted."

echo "Extracting $DB_ASSET..."
echo "fd2dev" | sudo -Sk -p "" tar -xzf "/var/tmp/$DB_ASSET" > /dev/null
error_check "Error extracting the database."
echo "  Extracted."

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

if [ -n "$CURRENT" ]; then
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from /var/tmp.${NO_COLOR}"
else
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from release $DB_RELEASE.${NO_COLOR}"
fi
