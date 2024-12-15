#!/bin/bash

MAX_TRIES=15
TRIES=0
URL="https://${CODESPACE_NAME}.app.github.dev" 

while [ "$TRIES" -lt "$MAX_TRIES" ]; do

  echo "Try $TRIES"

  if [ -n "$(curl -s "$URL")" ];
  then
    FOUND=1
    break
  fi

  ((TRIES++))

  sleep 1
done

if [ -n "$FOUND" ];
then
  code -r ".devcontainer/fd2_welcome.md"
else 
  code -r ".devcontainer/fd2_fail.md"
fi