#!/bin/bash
# shellcheck disable=SC1091  # Make sources okay.

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
REPO_DIR=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)
DB_DIR="$REPO_DIR/docker/db"
SAMPLE_DB_DIR="$(dirname "$REPO_DIR")/FD2-SampleDBs"
LAST_INSTALLED_DB="$REPO_DIR/.fd2/last-installed-db"
source "$REPO_DIR/bin/colors.bash"
source "$REPO_DIR/bin/lib.bash"
source "$REPO_DIR/bin/lib/checkServices.lib.bash"

function usage {
  echo "installDB.bash usage:"
  echo "  -h|--help : Display this message."
  echo ""
  echo "  The default behavior if no flags are provided is to install the"
  echo "  release of the sample database indicated in .fd2dev/db.conf."
  echo ""
  echo "  -c|--current : Reinstall the most recently installed sample database."
  echo "    - Reinstalls the most recently installed database archive from .fd2/."
  echo "    - If no archive has been recorded, .fd2/db.sample.tar.gz is used if it exists."
  echo "    - No other flags may be specified with -c|--current."
  echo ""
  echo "  --development : Install a locally built database from the sibling FD2-SampleDBs repository."
  echo "    - If --artifact is omitted, choose from the archives in FD2-SampleDBs/dist/."
  echo "    - Does not change .fd2dev/db.conf."
  echo "    - No other mode flags may be specified with --development."
  echo ""
  echo "    --artifact=<artifact> : If --development is used, a specific database archive to install can be specified."
  echo "      - E.g. --development --artifact db.sample.tar.gz"
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

if [ "$#" == "0" ]; then
  PREFERRED=1
else

  # Process the command line flags
  FLAGS=$(getopt -o a::c::h::l::p::r:: \
    --long asset::,artifact:,current::,development,help::,latest::,prompt::,release:: \
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
      --artifact)
        DB_ARTIFACT=$2
        shift 2
        ;;
      -c | --current)
        CURRENT=1
        shift 2
        ;;
      --development)
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

if [ -n "$DEVELOPMENT" ]; then
  SAMPLE_DB_ROOT=$(git -C "$SAMPLE_DB_DIR" rev-parse --show-toplevel 2> /dev/null)
  if [ -z "$SAMPLE_DB_ROOT" ] || [ "$(readlink -f "$SAMPLE_DB_ROOT")" != "$(readlink -f "$SAMPLE_DB_DIR")" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} The FD2-SampleDBs repository must exist as a sibling of FarmData2."
    echo "Expected repository at $SAMPLE_DB_DIR."
    exit 255
  fi
  if [ ! -d "$SAMPLE_DB_ROOT/dist" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} The FD2-SampleDBs dist directory does not exist."
    echo "Expected directory at $SAMPLE_DB_ROOT/dist."
    exit 255
  fi
fi

if [ -n "$PROMPT" ]; then
  if [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ] || [ -n "$DB_ARTIFACT" ] || [ -n "$CURRENT" ] || [ -n "$DEVELOPMENT" ] || [ -n "$LATEST" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -p|--prompt is specified, no other flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi
fi

if [ -n "$CURRENT" ]; then
  if [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ] || [ -n "$DB_ARTIFACT" ] || [ -n "$PROMPT" ] || [ -n "$DEVELOPMENT" ] || [ -n "$LATEST" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -c|--current is specified, no other flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi

  if [ -f "$LAST_INSTALLED_DB" ]; then
    DB_ASSET=$(cat "$LAST_INSTALLED_DB")
    if [ -z "$DB_ASSET" ] || [[ "$DB_ASSET" == */* ]]; then
      echo -e "${ON_RED}ERROR:${NO_COLOR} The last installed database marker contains an invalid archive name."
      exit 255
    fi
    if [ ! -f "$REPO_DIR/.fd2/$DB_ASSET" ]; then
      echo -e "${ON_RED}ERROR:${NO_COLOR} The last installed database archive recorded in $LAST_INSTALLED_DB is missing."
      exit 255
    fi
  elif [ -f "$REPO_DIR/.fd2/db.sample.tar.gz" ]; then
    DB_ASSET="db.sample.tar.gz"
  else
    echo "$REPO_DIR/.fd2/db.sample.tar.gz does not exist."
    echo "Switching to default behavior."
    unset CURRENT
    PREFERRED=1
  fi
fi

if [ -n "$DEVELOPMENT" ]; then
  if [ -n "$DB_RELEASE" ] || [ -n "$DB_ASSET" ] || [ -n "$CURRENT" ] || [ -n "$PROMPT" ] || [ -n "$LATEST" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When --development is specified, no other mode flags may be included."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi
  DB_ASSET=$DB_ARTIFACT
elif [ -n "$DB_ARTIFACT" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} --artifact may only be used with --development."
  echo "Use installDB.bash --help for usage information"
  exit 255
fi

if [ -n "$DB_ASSET" ]; then
  if [ -z "$DB_RELEASE" ] && [ -z "$DEVELOPMENT" ] && [ -z "$CURRENT" ]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} When -a|--asset is specified, the -r|--release flag must also be specified."
    echo "Use installDB.bash --help for usage information"
    exit 255
  fi
fi

if [ -n "$CURRENT" ]; then
  :
elif [ -n "$DEVELOPMENT" ]; then
  if [ -z "$DB_ASSET" ]; then
    mapfile -t DATABASES < <(find "$SAMPLE_DB_ROOT/dist" -maxdepth 1 -type f -name 'db.*.tar.gz' -printf '%f\n' | sort)
    if [ "${#DATABASES[@]}" -eq 0 ]; then
      echo -e "${ON_RED}ERROR:${NO_COLOR} No database archives were found in $SAMPLE_DB_ROOT/dist."
      exit 255
    fi
    echo "Choose the database to install."
    select DB_ASSET in "${DATABASES[@]}"; do
      if ((REPLY <= 0 || REPLY > ${#DATABASES[@]})); then
        echo -e "${ON_RED}ERROR:${NO_COLOR} Invalid choice. Please try again."
      else
        break
      fi
    done
  fi
  if [[ "$DB_ASSET" == */* || ! "$DB_ASSET" == db.*.tar.gz || ! -f "$SAMPLE_DB_ROOT/dist/$DB_ASSET" ]]; then
    echo -e "${ON_RED}ERROR:${NO_COLOR} Database artifact \"$DB_ASSET\" does not exist in $SAMPLE_DB_ROOT/dist."
    exit 255
  fi
elif [ -n "$DB_RELEASE" ] && [ -n "$DB_ASSET" ]; then
  echo "Checking if database asset $DB_ASSET exists in release $DB_RELEASE..."

  # shellcheck disable=SC2207
  RELEASES=(
    $(gh release list \
      --repo FarmData2/FD2-SampleDBs \
      | head -n5 | cut -f1)
  )
  # shellcheck disable=SC2207
  REL_INFO=$(gh release view --repo FarmData2/FD2-SampleDBs "$DB_RELEASE")
  echo "$REL_INFO" | eval grep "$DB_ASSET" > /dev/null
  error_check "  Unable to verify that database asset \"$DB_ASSET\" exists in release."
  echo "  Database asset exists in release."
else
  if [ -n "$LATEST" ]; then
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
  elif [ -n "$PREFERRED" ]; then
    DB_RELEASE=$(cat "$REPO_DIR/.fd2dev/db.conf" | head -1)
    DB_ASSET=$(cat "$REPO_DIR/.fd2dev/db.conf" | tail -1)
  elif [ -n "$PROMPT" ]; then
    # shellcheck disable=SC2207
    RELEASES=(
      $(gh release list \
        --exclude-drafts \
        --exclude-pre-releases \
        --repo FarmData2/FD2-SampleDBs \
        | head -n5 | cut -f1)
    )

    echo "The 5 most recent releases are shown."
    echo "If an older or pre-release see the --release and --asset flags."
    echo "  Use installDB.bash --help for usage information."
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
  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from $REPO_DIR/.fd2/...${NO_COLOR}"
elif [ -n "$DEVELOPMENT" ]; then
  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from $SAMPLE_DB_ROOT/dist/...${NO_COLOR}"
  mkdir -p "$REPO_DIR/.fd2"
  error_check "Unable to create the database archive directory."
  cp "$SAMPLE_DB_ROOT/dist/$DB_ASSET" "$REPO_DIR/.fd2/$DB_ASSET"
  error_check "Unable to copy the development database archive."
  echo "Database staged in .fd2/."
else
  echo -e "${UNDERLINE_GREEN}Installing $DB_ASSET from release $DB_RELEASE...${NO_COLOR}"

  if [ -f "$REPO_DIR/.fd2/$DB_ASSET" ]; then
    echo "Deleting existing database archives..."
    rm "$REPO_DIR/.fd2/$DB_ASSET"
    error_check "Unable to delete existing database archives."
    echo "  Deleted."
  fi

  echo "Downloading database \"$DB_ASSET\" from release $DB_RELEASE..."
  gh release download "$DB_RELEASE" \
    --repo FarmData2/FD2-SampleDBs \
    --dir "$REPO_DIR/.fd2/" \
    --pattern "$DB_ASSET" \
    --clobber
  error_check "Unable to download the database."
  echo "Database downloaded."

fi

if [ -z "$CURRENT" ]; then
  # If Drupal is not connected to the database then this is a new codespace and we have
  # not yet installed a database, so we don't need to uninstall the FarmData2 module.
  DB_CONNECTED=$(docker exec fd2_farmos drush status | grep -E "^Database\s+: Connected")
  FD2_ENABLED=$(docker exec fd2_farmos drush pm-list --type=Module --status=enabled 2> /dev/null | grep "(farm_fd2)")
  if [ -n "$DB_CONNECTED" ] && [ -n "$FD2_ENABLED" ]; then
    # If we didn't use the same DB then uninstall the FarmData2 module here.
    # We will rebuild and reinstall it after the new database has been installed.
    # This is important when we switch to a branch where the module targets a different DB version.
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

if [ -z "$CURRENT" ]; then
  echo "Re-adding the farm_fd2 module to farmOS..."
  # Now rebuild and reinstall the FarmData2 module.
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

echo -e "${ORANGE}RECOMMENDED ACTION: Clear browser cache.${NO_COLOR}"

if [ -n "$CURRENT" ]; then
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from $REPO_DIR/.fd2/.${NO_COLOR}"
elif [ -n "$DEVELOPMENT" ]; then
  printf '%s\n' "$DB_ASSET" > "$LAST_INSTALLED_DB"
  error_check "Unable to record the most recently installed database."
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from $SAMPLE_DB_ROOT/dist.${NO_COLOR}"
else
  printf '%s\n' "$DB_ASSET" > "$LAST_INSTALLED_DB"
  error_check "Unable to record the most recently installed database."
  echo "$DB_RELEASE" > "$REPO_DIR/.fd2dev/db.conf"
  echo "$DB_ASSET" >> "$REPO_DIR/.fd2dev/db.conf"
  echo -e "${UNDERLINE_GREEN}Installed $DB_ASSET from release $DB_RELEASE.${NO_COLOR}"
fi
