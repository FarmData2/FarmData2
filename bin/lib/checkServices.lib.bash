# A collection of functions that check if the
# services that make up the FarmData2 development
# environment are up and running.
#
# Each of the functions returns a zero value on success
# and a non-zero value on failure.

function checkService {
  SERVICE_NAME=$1
  CHECK_COMMAND=$2
  OK_RESULT=$3
  MAX_TRIES=$4
  TRIES=0

  echo -n "Checking for $SERVICE_NAME "
  echo -n "."
  RESP=$(eval "$CHECK_COMMAND 2> /dev/null" | grep "$OK_RESULT")
  while [ "$RESP" == "" ] && [ $TRIES -lt "$MAX_TRIES" ]; do
    sleep 1
    echo -n "."
    RESP=$(eval "$CHECK_COMMAND 2> /dev/null" | grep -E "$OK_RESULT")
    ((TRIES++))
  done

  if [ "$RESP" == "" ]; then
    echo " not found."
    return 1
  else
    echo " running."
    return 0
  fi
}

function checkDocker {
  checkService docker "docker ps" "CONTAINER ID" 30
}

function checkPostgres {
  checkService postgres "docker exec fd2_postgres pg_isready" "/var/run/postgresql:5432 - accepting connections" 30
}

function checkNoVNC {
  checkService noVNC "curl -Is localhost:6901" "HTTP/1.1 200 OK" 30
}

function checkNginxFarmOS {
  checkService nginx "curl -kIs --max-time 1 https://localhost" "HTTP/1.1 200 OK|HTTP/1.1 403 Forbidden" 30
}

function checkAllServers {
  echo "Checking for the FarmData2 Development Environment servers..."
  checkPostgres
  POSTGRES_STATUS=$?
  checkNoVNC
  NO_VNC_STATUS=$?
  checkNginxFarmOS
  NGINX_FARMOS_STATUS=$?

  return $((POSTGRES_STATUS + NO_VNC_STATUS + NGINX_FARMOS_STATUS))
}
