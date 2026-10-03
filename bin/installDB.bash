#!/bin/bash
# shellcheck disable=SC1091  # Make sources okay.

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
REPO_DIR=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)
DB_DIR="$REPO_DIR/docker/db"
SAMPLE_DB_REPO="$(dirname "$REPO_DIR")/FD2-SampleDBs"
LAST_INSTALLED_DB="$REPO_DIR/.fd2/last-installed-db"
source "$REPO_DIR/bin/colors.bash"
source "$REPO_DIR/bin/lib.bash"
source "$REPO_DIR/bin/lib/checkServices.lib.bash"

function usage {
  echo "installDB.bash usage:"
  echo "  -h|--help : Display this message."
  echo ""
  echo "  The default behavior if no flags are provided is to install the release of"
  echo "  the sample database for the current branch as indicated in .fd2dev/db.conf."
  echo ""
  echo "  -c|--current : Reinstall the most recently installed sample database."
  echo "    - Reinstalls the most recently installed database archive from .fd2/."
  echo "    - If no current database is found the command fails."
  echo "    - Does not change .fd2dev/db.conf."
  echo "    - No other flags may be specified with -c|--current."
  echo ""
  echo "  -d|--development : Install a locally built database from the sibling FD2-SampleDBs repository."
  echo "    - Prompt for the asset to install from those in FD2-SampleDBs/dist/."
  echo "    - Does not change .fd2dev/db.conf."
  echo "    - No other mode flags may be specified with -d|--development."
  echo ""
  echo "    - If -d|--development is specified then a database asset must also be specified:"
  echo "      -a<asset>|--asset=<asset> : Asset from the release to install."
  echo "        - E.g. --asset=db.sample.tar.gz"
  echo "        - E.g. --asset=db.base.tar.gz"
  echo "        - Available assets can be found in the the ~/FD2-SampleDBs/dist directory."
  echo ""
  echo "  -l|--latest : Install the latest release of the sample database."
  echo "    - No other flags may be specified with -l|--latest."
  echo ""
  echo "  -p|--prompt : Prompt for the release and database artifact to install."
  echo "    - No other flags may be specified with -p|--prompt."
  echo "    - Only full releases are listed in the prompt, see below to use a pre-release."
  echo ""
  echo "  -r<release>|--release=<release> : Specify the release to use."
  echo "    - E.g. --release=v2.0.1"
  echo "    - E.g. --release=v2.0.2.development.1"
  echo "    - Releases can be found at https://github.com/FarmData2/FD2-SampleDBs/releases"
  echo ""
  echo "    - If -r|--release is specified then a database asset must also be specified:"
  echo "      -a<asset>|--asset=<asset> : Asset from the release to install."
  echo "        - E.g. --asset=db.sample.tar.gz"
  echo "        - E.g. --asset=db.base.tar.gz"
  echo "        - Assets can be found at https://github.com/FarmData2/FD2-SampleDBs/releases"
  echo ""
  exit 255
}

function setup_current {
  if [ -n "$DEVELOPMENT" ] || [ -n "$LATEST" ] || [ -n "$PROMPT" ] || [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -c|--current is specified, no other flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  # If there is a record of the last installed database, try to use that.
  if [ -f "$LAST_INSTALLED_DB" ]; then
    DB_ASSET=$(cat "$LAST_INSTALLED_DB")
  fi

  # If the last installed database doesn't exist, try to use the sample database.
  # Fallback for backwards compatibility with older codespaces that don't have a record of the last installed database.
  if [ ! -f "$REPO_DIR/.fd2/$DB_ASSET" ] && [ -f "$REPO_DIR/.fd2/db.sample.tar.gz" ]; then
    DB_ASSET="db.sample.tar.gz"
  fi

  if [ -z "$DB_ASSET" ]; then
    # If we don't have a current database bail out.
    echo "No current database archive found in $REPO_DIR/.fd2/."
    echo "Install a database before using the -c|--current flag."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  echo -e "${UNDERLINE_GREEN}Reinstalling $DB_ASSET from $REPO_DIR/.fd2/...${NO_COLOR}"
}

function setup_development {

  if [ -n "$CURRENT" ] || [ -n "$PROMPT" ] || [ -n "$LATEST" ] || [ -n "$DB_RELEASE" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Only -a|--asset is permitted with -d|--development."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  if [ ! -d "$SAMPLE_DB_REPO" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} The FD2-SampleDBs repository must be in a sibling directory to FarmData2."
    exit 255
  fi

  if [ ! -d "$SAMPLE_DB_REPO/dist" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} The FD2-SampleDBs/dist directory does not exist."
    echo "Be sure that a database has been built in FD2-SampleDBs/dist."
    exit 255
  fi

  if [ -z "$DB_ASSET" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} A --asset must be specified when using --development."
    exit 255
  fi

  if [ ! -f "$SAMPLE_DB_REPO/dist/$DB_ASSET" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Asset $DB_ASSET not found in $SAMPLE_DB_REPO/dist/."
    exit 255
  fi

  mkdir -p "$REPO_DIR/.fd2"
  error_check "Unable to create $REPO_DIR/.fd2."
  cp "$SAMPLE_DB_REPO/dist/$DB_ASSET" "$REPO_DIR/.fd2/$DB_ASSET"
  error_check "Unable to copy $SAMPLE_DB_REPO/dist/$DB_ASSET to $REPO_DIR/.fd2/$DB_ASSET."

  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from $SAMPLE_DB_REPO/dist/...${NO_COLOR}"
}

function setup_latest {

  if [ -n "$CURRENT" ] || [ -n "$DEVELOPMENT" ] || [ -n "$PROMPT" ] || [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -l|--latest is specified, no other flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  # shellcheck disable=SC2207
  RELEASES=(
    $(gh release list \
      --exclude-drafts \
      --exclude-pre-releases \
      --repo FarmData2/FD2-SampleDBs \
      | cut -f1)
  )

  DB_RELEASE="${RELEASES[0]}"
  DB_ASSET="db.sample.tar.gz"

  download_db_release_asset

  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from release $DB_RELEASE...${NO_COLOR}"
}

function setup_preferred {

  if [ ! -f "$REPO_DIR/.fd2dev/db.conf" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} No database version pin found in $REPO_DIR/.fd2dev/db.conf."
    echo "Use installDB.bash --help to install a database another way and create a the pin."
    exit 255
  fi

  DB_RELEASE=$(cat "$REPO_DIR/.fd2dev/db.conf" | head -1)
  DB_ASSET=$(cat "$REPO_DIR/.fd2dev/db.conf" | tail -1)

  download_db_release_asset

  echo -e "${UNDERLINE_GREEN}Installing pinned $DB_ASSET from release $DB_RELEASE...${NO_COLOR}"
}

function setup_prompt {

  if [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ] || [ -n "$DB_ARTIFACT" ] || [ -n "$CURRENT" ] || [ -n "$DEVELOPMENT" ] || [ -n "$LATEST" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -p|--prompt is specified, no other flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  # shellcheck disable=SC2207
  RELEASES=(
    $(gh release list \
      --exclude-drafts \
      --exclude-pre-releases \
      --repo FarmData2/FD2-SampleDBs \
      | head -n5 | cut -f1)
  )

  echo "The 5 most recent releases are shown."
  echo "For an older release or a pre-release see the --release and --asset flags."
  echo "  Use installDB.bash --help for usage information."
  echo ""
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

  download_db_release_asset

  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from release $DB_RELEASE...${NO_COLOR}"
}

function setup_release_asset {

  # shellcheck disable=SC2207
  RELEASES=(
    $(gh release list \
      --repo FarmData2/FD2-SampleDBs \
      | head -n5 | cut -f1)
  )
  # shellcheck disable=SC2207
  REL_INFO=$(gh release view --repo FarmData2/FD2-SampleDBs "$DB_RELEASE")
  if ! echo "$REL_INFO" | eval grep "$DB_ASSET" > /dev/null; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Database asset \"$DB_ASSET\" not found in release \"$DB_RELEASE\"."
    echo "Double check the releases and assets on https://github.com/FarmData2/FD2-SampleDBs/releases"
    exit 255
  fi

  download_db_release_asset

  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from release $DB_RELEASE...${NO_COLOR}"
}

function download_db_release_asset {
  if [ -f "$REPO_DIR/.fd2/$DB_ASSET" ]; then
    rm "$REPO_DIR/.fd2/$DB_ASSET"
    error_check "Unable to delete existing database $REPO_DIR/.fd2/$DB_ASSET archive."
  fi

  gh release download "$DB_RELEASE" \
    --repo FarmData2/FD2-SampleDBs \
    --dir "$REPO_DIR/.fd2/" \
    --pattern "$DB_ASSET" \
    --clobber
  error_check "Unable to download the database asset $DB_ASSET from release $DB_RELEASE."
}

if [ "$#" == "0" ]; then
  PREFERRED=1
else

  # Process the command line flags
  FLAGS=$(getopt -o a::c::d::h::l::p::r:: \
    --long asset::,current::,development,help::,latest::,prompt::,release:: \
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
      -d | --development)
        DEVELOPMENT=1
        shift
        ;;
      -h | --help)
        HELP=1
        shift
        ;;
      -l | --latest)
        LATEST=1
        shift 2
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

if [ -n "$HELP" ]; then
  usage
fi

# Place the correct db.*.tgz.gz files in .fd2/ based on the options.
if [ -n "$CURRENT" ]; then
  setup_current
elif [ -n "$DEVELOPMENT" ]; then
  setup_development
elif [ -n "$LATEST" ]; then
  setup_latest
elif [ -n "$PREFERRED" ]; then
  setup_preferred
elif [ -n "$PROMPT" ]; then
  setup_prompt
elif [ -n "$DB_RELEASE" ] && [ -n "$DB_ASSET" ]; then
  setup_release_asset
else
  echo "Either no argument must be provided (default behavior) or"
  echo "one of -c|--current, -l|--latest or -p|--prompt or"
  echo "-d|--development and -a|--asset must be provided or"
  echo "both -r|--release and -a|--asset must be provided."
  echo "Use installDB.bash --help for usage information"
fi

# If we are not in a new codespace and we are not installing the current database over itself (e.g. to reset)
# then we need to uninstall the FarmData2 module from farmOS before we install the new database
# because it may include different custom fields that are incompatible with the current database.
# If we uninstall the module here it will be rebuilt and reinstalled after the new database has been installed.

DB_CONNECTED=$(docker exec fd2_farmos drush status | grep -E "^Database\s+: Connected")
FD2_ENABLED=$(docker exec fd2_farmos drush pm-list --type=Module --status=enabled 2> /dev/null | grep "(farm_fd2)")
# If we are not in a new codespace...
if [ -n "$DB_CONNECTED" ] && [ -n "$FD2_ENABLED" ]; then

  # If we are not installing the current database over itself...
  if [ -z "$CURRENT" ]; then
    echo "Uninstalling the FarmData2 module..."
    echo "  Deleting custom farm_fd2 module custom fields..."
    "$REPO_DIR/bin/deleteCustomFD2Fields.bash" > /dev/null 2>&1
    echo "  Deleted."
    echo "  Running farmOS cron to update fields..."
    docker exec fd2_farmos drush cron > /dev/null 2>&1
    error_check "Unable to run cron."
    echo "  Done."
    echo "  Removing farm_fd2 module from farmOS..."
    docker exec fd2_farmos drush pmu farm_fd2 -y > /dev/null 2>&1
    error_check "Unable to remove the farm_fd2 module from farmOS."
    echo "  Removed."
    echo "Uninstalled."
  fi
fi

echo "Stopping farmOS..."
docker stop fd2_farmos > /dev/null
error_check "Error occurred stopping farmOS."
echo "Stopped."

echo "Stopping nginx..."
docker stop fd2_nginx > /dev/null
error_check "Error occurred stopping nginx."
echo "Stopped."

echo "Stopping Postgres..."
docker stop fd2_postgres > /dev/null
error_check "Error occurred stopping Postgres."
echo "Stopped."

safe_cd "$DB_DIR"

echo "Deleting current database..."
rm -rf ./*
error_check "Unable to delete the current database."
echo "Deleted."

echo "Extracting $DB_ASSET..."
tar -xzf "$REPO_DIR/.fd2/$DB_ASSET" > /dev/null
error_check "Error extracting the database."
echo "Extracted."

echo "Restarting..."
docker start fd2_postgres > /dev/null
checkPostgres
POSTGRES=$?
if ((!POSTGRES)); then
  echo -e "${ON_RED}ERROR:${NO_COLOR} Postgres did not restart."
  echo "  Try running installDB.bash again."
  exit 255
fi

docker start fd2_farmos > /dev/null
# Check drupal here because we can't check for farmOS until nginx is running.
checkDrupal
DRUPAL=$?
if ((!DRUPAL)); then
  echo -e "${ON_RED}ERROR:${NO_COLOR} drupal id not restart."
  echo "  Try running installDB.bash again."
  exit 255
fi

docker start fd2_nginx > /dev/null
checkNginx
NGINX=$?
if ((!NGINX)); then
  echo -e "${ON_RED}ERROR:${NO_COLOR} nginx did not restart."
  echo "  Try running installDB.bash again."
  exit 255
fi

# Note: We can't check for farmOS until after nginx is running.
checkFarmOS
FARMOS=$?
if ((!FARMOS)); then
  echo -e "${ON_RED}ERROR:${NO_COLOR} farmOS did not restart."
  echo "  Try running installDB.bash again."
  exit 255
fi

echo "Restarted."

# If we are not installing the current database over itself, then we need to
# rebuilt the FarmData2 module to be sure that it has the correct custom fields.
if [ -z "$CURRENT" ]; then
  echo "Re-adding the farm_fd2 module to farmOS..."
  echo "  Building farm_fd2 module..."
  npm run build:fd2 > /dev/null
  error_check "Unable to rebuild the FarmData2 module."
  echo "  Built."
  echo "  Installing farm_fd2 module into farmOS..."
  docker exec fd2_farmos drush en farm_fd2 -y > /dev/null 2>&1
  error_check "Unable to reinstall the FarmData2 module."
  echo "  Installed."
  echo "Added."
fi

echo "Clearing the Drupal cache..."
docker exec fd2_farmos drush cr > /dev/null 2>&1
error_check "Unable to clear the cache."
echo "Cleared."

# Record the most recently installed DB asset.
printf '%s\n' "$DB_ASSET" > "$LAST_INSTALLED_DB"
error_check "Unable to record $DB_ASSET as the most recently installed database in $LAST_INSTALLED_DB."

if [ -n "$CURRENT" ]; then
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from $REPO_DIR/.fd2/.${NO_COLOR}"
elif [ -n "$DEVELOPMENT" ]; then
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from $SAMPLE_DB_REPO/dist.${NO_COLOR}"
else
  echo "$DB_RELEASE" > "$REPO_DIR/.fd2dev/db.conf"
  echo "$DB_ASSET" >> "$REPO_DIR/.fd2dev/db.conf"
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from release $DB_RELEASE.${NO_COLOR}"
fi
