#!/bin/bash

docker exec fd2_dev sh -c \
"nohup inotifywait -mr \
  --exclude 'node_modules' \
  --exclude '/home/fd2dev/\..*' \
  -e create,delete,modify /home/fd2dev | \
  while read -r dirname events basename; do       
    echo 'FD2 Dev Environment Heartbeat' | ncat 172.18.0.1 8888  
  done > /dev/null 2>&1 &"