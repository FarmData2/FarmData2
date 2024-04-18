# On GitPod:
#   - The user gitpod:
#     - has UID 33333
#     - is in the group gitpod which has GID of 33333
#   - The group docker:
#     - has GID 999, which matches the group in the container.

# Because we know this, we can take some shortcuts as compared
# to the full linux setup.

rm -rf ~/.fd2/gids &> /dev/null
mkdir ~/.fd2/gids

# Use the existing docker group
#   Note: The docker.sock does not need to be assigned to this group.
#         docker.sock is already assigned to the gitpod group
#         and the gitpod user is in the gitpod group.
echo "999" > ~/.fd2/gids/docker.gid

#usermod -a -G docker "$(id -un)"
#sudo chgrp docker /var/run/docker.sock
#sudo chmod g+w /var/run/docker.sock

# Use the existing gitpod group as the fd2grp group.
#   Note: The gitpod user is in the gitpod group and
#         thus the fd2dev user will be in a group with the same GID.
echo "33333" > ~/.fd2/gids/fd2grp.gid
