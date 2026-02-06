# A collection of functions that check if the
# services that make up the FarmData2 development
# environment are up and running.
#
# Each of the functions returns:
#  - a zero value on success
#  - a non-zero value on failure.
#
# Note that in bash 0 is true, and non-zero is false.
# So despite this seeming weird and opposite of other languages,
# it leads to more intuitive if statements like:
#   if checkPostgres; then
#     echo "Postgres is running."
#   fi

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
  checkService postgres "docker exec fd2_postgres pg_isready" "accepting connections" 30
}

function checkDrupal {
  checkService Drupal "docker exec fd2_farmos drush core-status" "Drupal version" 30
}

function checkNoVNC {
  checkService noVNC "curl -Is localhost:6901" "HTTP/1.1 200 OK" 30
}

function checkNginx {
  checkService nginx "docker exec fd2_nginx curl -k --max-time 1 https://localhost/nginx_status" "Active connections" 30
}

function checkFarmOS {
  checkService farmOS "curl -kIs --max-time 1 https://localhost" "HTTP/1.1 403 Forbidden|HTTP/1.1 200 OK" 30
}

function checkDocs {
  checkService Documentation "curl -Is --max-time 1 http://localhost:8082/docs/index.md" "HTTP/1.1 200 OK" 30
}
