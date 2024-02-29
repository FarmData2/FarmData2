# Handles all of the permissions issues that arise when mounting
# directories from the host machine into the container on linux/wsl.

if [ "$PROFILE" == "linux" ] || [ "$PROFILE" == "wsl" ]; then
  echo "Configuring Linux or Windows (WSL) host..."
  # We now know this path exists on all platforms.
  DOCKER_SOCK_PATH=/var/run/docker.sock
  echo "  Using docker socket at $DOCKER_SOCK_PATH."
  # If the docker group doesn't exist on the host, create it.
  DOCKER_GRP_EXISTS=$(grep "docker" /etc/group)
  if [ -z "$DOCKER_GRP_EXISTS" ]; then
    echo "  Creating new docker group on host."
    sudo groupadd docker
    error_check
    DOCKER_GRP_GID=$(grep "^docker:" /etc/group | cut -d':' -f3)
    echo "  docker group created with GID=$DOCKER_GRP_GID."
  else
    DOCKER_GRP_GID=$(grep "^docker:" /etc/group | cut -d':' -f3)
    echo "  docker group exists on host with GID=$DOCKER_GRP_GID."
  fi

  # If the current user is not in the docker group add them.
  USER_IN_DOCKER_GRP=$(groups | grep "docker")
  if [ -z "$USER_IN_DOCKER_GRP" ]; then
    echo "  Adding user $(id -un) to the docker group."
    sudo usermod -a -G docker "$(id -un)"
    error_check
    echo "  User $(id -un) added to the docker group."
    echo "  ***"
    echo "  *** Run the ./fd2-up.bash script again to continue."
    echo "  ***"
    exec newgrp docker
  else
    echo "  User $(id -un) is in docker group."
  fi

  # If the docker.sock does not belong to the docker group assign it.
  # shellcheck disable=SC2010
  SOCK_IN_DOCKER_GRP=$(ls -lH "$DOCKER_SOCK_PATH" | grep " docker ")
  if [ -z "$SOCK_IN_DOCKER_GRP" ]; then
    echo "  Assigning $DOCKER_SOCK_PATH to the docker group."
    sudo chgrp docker $DOCKER_SOCK_PATH
    error_check
    echo "  $DOCKER_SOCK_PATH assigned to docker group."
  else
    echo "  $DOCKER_SOCK_PATH belongs to docker group."
  fi

  # If the docker group does not have write permission to docker.sock add it.
  # shellcheck disable=SC2012
  DOCKER_GRP_RW_SOCK=$(ls -lH $DOCKER_SOCK_PATH | cut -c 5-6 | grep "rw")
  if [ -z "$DOCKER_GRP_RW_SOCK" ]; then
    echo "  Granting docker group RW access to $DOCKER_SOCK_PATH."
    sudo chmod g+rw $DOCKER_SOCK_PATH
    error_check
    echo "  docker group granted RW access to $DOCKER_SOCK_PATH."
  else
    echo "  docker group has RW access to $DOCKER_SOCK_PATH."
  fi

  echo "Configuring FarmData2 group (fd2grp)..."
  # If group fd2grp does not exist on host create it
  FD2GRP_EXISTS=$(grep "fd2grp" /etc/group)
  if [ -z "$FD2GRP_EXISTS" ]; then
    echo "  Creating fd2grp group on host."
    FD2GRP_GID=$(tail -n 1 "$SCRIPT_DIR"/fd2grp.gid)
    FD2GRP_GID_EXISTS=$(grep ":$FD2GRP_GID:" /etc/group)
    if [ -n "$FD2GRP_GID_EXISTS" ]; then
      echo "Attempted to create the fd2grp with GID=$FD2GRP_GID."
      echo "Host machine already has a group with that GID."
      echo "Finding an unused GID for fd2grp."

      desired_gid=$((FD2GRP_GID + 1))
      while true; do
        if ! getent group $desired_gid > /dev/null; then
          break
        fi
        ((desired_gid++))
      done
      FD2GRP_GID=$desired_gid
      echo "  Found unused GID=$FD2GRP_GID for fd2grp."
    fi

    sudo -S groupadd --gid "$FD2GRP_GID" fd2grp
    error_check
    echo "  fd2grp group created on host with GID=$FD2GRP_GID."
  else
    FD2GRP_GID=$(getent group fd2grp | cut -d: -f3)
    echo "  fd2grp group exists on host with GID=$FD2GRP_GID."
  fi

  # If the current user is not in the fd2grp then add them.
  USER_IN_FD2GRP=$(groups | grep "fd2grp")
  if [ -z "$USER_IN_FD2GRP" ]; then
    echo "  Adding user $(id -un) to the fd2grp group."
    sudo usermod -a -G fd2grp "$(id -un)"
    error_check
    echo "  User user $(id -un) added to the fd2grp group."
    echo "  ***"
    echo "  *** Run the fd2-up.bash script again to continue."
    echo "  ***"
    exec newgrp fd2grp
  else
    echo "  User $(id -un) is in fd2grp group."
  fi

  # If the FarmData2 directory is not in the fd2grp then set it.
  # shellcheck disable=SC2010
  FD2GRP_OWNS_FD2=$(ls -ld "../../$FD2_DIR" | grep " fd2grp ")
  if [ -z "$FD2GRP_OWNS_FD2" ]; then
    echo "  Assigning $FD2_DIR to the fd2grp group."
    sudo chgrp -R fd2grp "../../$FD2_DIR"
    error_check
    echo "  $FD2_DIR assigned to the fd2grp group."
  else
    echo "  $FD2_DIR is in fd2grp group."
  fi

  # If the fd2grp does not have RW access to FarmData2 change it.
  # shellcheck disable=SC2012
  FD2GRP_RW_FD2=$(ls -ld "../../$FD2_DIR" | cut -c 5-6 | grep "rw")
  if [ -z "$FD2GRP_RW_FD2" ]; then
    echo "  Granting fd2grp RW access to $FD2_DIR."
    sudo chmod -R g+rw "../../$FD2_DIR"
    error_check
    echo "  fd2grp granted RW access to $FD2_DIR."
  else
    echo "  fd2grp has RW access to $FD2_DIR."
  fi

  rm -rf ~/.fd2/gids &> /dev/null
  mkdir ~/.fd2/gids
  echo "$FD2GRP_GID" > ~/.fd2/gids/fd2grp.gid
  echo "$DOCKER_GRP_GID" > ~/.fd2/gids/docker.gid
fi
