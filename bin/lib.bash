# Checks if prior operation succeeded and terminates if not.
# Used throughout to avoid continuing if an operation fails.
function error_check {
  if [ "$?" != "0" ]; then
    if [ "$1" == "" ]; then
      echo "** Terminating: Error in last operation."
    else
      echo "** Terminating: $1"
    fi
    exit 255
  fi
}

# Request and verify the sudo password.
# Ensures the user has sudo access before proceeding.
function verify_sudo {
  sudo -v
  error_check "Unable to verify sudo credentials. Please check your password."
}

# Check if running in the dev environment.
# Returns 0 if in dev, 1 otherwise.
function is_dev_environment {
  if [ "$DEV_ENV" == "true" ] || [ -f "/.dockerenv" ]; then
    return 0
  else
    return 1
  fi
}

# Check if the script is being run as root.
# Exits with error if running as root when it shouldn't be.
function check_not_root {
  if [ "$EUID" -eq 0 ]; then
    echo "** Terminating: This script should not be run as root."
    exit 255
  fi
}

# Check if the docker daemon is running.
# Exits with error if docker is not available.
function check_docker_running {
  if ! docker info > /dev/null 2>&1; then
    echo "** Terminating: Docker daemon is not running."
    echo "Please start Docker and try again."
    exit 255
  fi
}

# Waits for the novnc server to come up.
# This is the last thing done in the fd2dev container,
# so once it is up, the container is ready to be used.
function wait_for_novnc {
  NO_VNC_RESP=$(curl -Is localhost:6901 | grep "HTTP/1.1 200 OK")
  i=1
  sp="/-\|"
  echo -n ' '
  while [ "$NO_VNC_RESP" == "" ]; do
    # shellcheck disable=SC2059
    printf "\b${sp:i++%${#sp}:1}"
    NO_VNC_RESP=$(curl -Is localhost:6901 | grep "HTTP/1.1 200 OK")
    sleep 1
  done
  printf "\b "
}

# Check if the URL provided as a parameter is accessible.
# Returns "" if it is not.
# Returns the URL followed by OK if it is.
function check_url {
  URL=$1
  RESP=$(curl -Is "$URL" | grep "HTTP/1.1 200 OK")
  if [ "$RESP" == "" ]; then
    echo ""
  else
    echo "$URL OK"
  fi
}

# Wait for up to 10 seconds for a URL to become available.
# Returns "" if the URL does not become available.
# Returns the URL followed by OK if it becomes available.
function wait_for_url {
  URL=$1
  TRIES=0
  RESP=$(curl -Is "$URL" | grep "HTTP/1.1 200 OK")
  while [ "$RESP" == "" ] && [ $TRIES -lt 10 ]; do
    sleep 1
    RESP=$(curl -Is "$URL" | grep "HTTP/1.1 200 OK")
    ((TRIES++))
  done
  if [ "$RESP" == "" ]; then
    echo ""
  else
    echo "$URL OK"
  fi
}

# Compute the XOR (i.e. exactly one of) of the provided arguments.
# Non-null/non-empty strings are true, empty/null strings are false.
function xor {
  # Adapted from here:
  # https://stackoverflow.com/questions/56700325/xor-conditional-in-bash
  local -i cnt=0
  while [[ $# -gt 0 ]]; do
    [[ -n $1 ]] && ((cnt++))
    shift
  done
  [ "$cnt" -eq "1" ]
}

# Change to the specified directory with error handling.
# Displays an error message if the directory is missing.
function safe_cd {
  cd "$1" 2> /dev/null || (
    echo -e "${ON_RED}ERROR:${NO_COLOR} Directory $1 is missing."
    echo -e "Restore this directory and try again."
    exit 255
  ) || exit 255
}
