#!/bin/bash

GROUP1=sggrp1
GROUP2=sggrp2

if [ -z "$IN_GROUP1" ]; then
  sudo groupadd "$GROUP1"
  sudo usermod -aG "$GROUP1" "$(whoami)"

  echo "First if"
  echo "My groups are...$(groups)"

  export IN_GROUP1=1
  exec sg "$GROUP1" "exec '$0' $(printf "'%s' " "$@")"

elif [ -z "$IN_GROUP2" ]; then

  sudo groupadd "$GROUP2"
  sudo usermod -aG "$GROUP2" "$(whoami)"

  echo "Second if"
  echo "My groups are...$(groups)"

  export IN_GROUP2=1
  exec sg "$GROUP2" "exec '$0' $(printf "'%s' " "$@")"

fi

echo "After if"
echo "My groups are...$(groups)"
newgrp "fd2grp"
