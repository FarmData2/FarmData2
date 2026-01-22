# A collection of functions that check if the 
# servers that make up the FarmData2 development
# environment are up and running.

function waitForIt {
  SERVICE_NAME=$1
  CHECK_COMMAND=$2
  OK_RESULT=$3
  MAX_TRIES=$4
  TRIES=0

  echo -n "Waiting for $SERVICE_NAME "
  echo -n "."
  RESP=$(eval "$CHECK_COMMAND 2> /dev/null" | grep "$OK_RESULT")
  while [ "$RESP" == "" ] && [ $TRIES -lt "$MAX_TRIES" ]; do
    sleep 1
    echo -n "."
    RESP=$(eval "$CHECK_COMMAND 2> /dev/null" | grep "$OK_RESULT")
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

function waitForPostgres {
  waitForIt postgres "docker exec fd2_postgres pg_isready" "/var/run/postgresql:5432 - accepting connections" 15
}

function waitForNoVNC {
  waitForIt noVNC "curl -Is localhost:6901" "HTTP/1.1 200 OK" 15
}

function waitForFarmOS {
  waitForIt farmOS "curl -sI http://farmos" "Server: Apache" 15
}

function waitForNginx {
  waitForIt nginx "curl -ksI --connect-timeout 1 https://proxy" "Server: nginx" 15
}

function waitForAll {
  waitForPostgres; POSTGRES_STATUS=$?
  waitForNoVNC; NO_VNC_STATUS=$?
  waitForFarmOS; FARMOS_STATUS=$?
  waitForNginx; NGINX_STATUS=$?

  return $(( POSTGRES_STATUS + NO_VNC_STATUS + FARMOS_STATUS + NGINX_STATUS ))  
}