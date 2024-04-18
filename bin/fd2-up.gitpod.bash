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
#   Note: The gitpod user is in the gitpod group.

#         Do we still need to do the recursive group assignment?

# # If the FarmData2 directory is not in the fd2grp then set it.
# # shellcheck disable=SC2010
# FD2GRP_OWNS_FD2=$(ls -ld "$FD2_PATH" | grep " fd2grp ")
# if [ -z "$FD2GRP_OWNS_FD2" ]; then
#   echo "  Assigning $FD2_DIR to the fd2grp group."
#   sudo chgrp -R fd2grp "$FD2_PATH"
#   error_check
#   echo "  $FD2_DIR assigned to the fd2grp group."
# else
#   echo "  $FD2_DIR is in fd2grp group."
# fi

# # If the fd2grp does not have RW access to FarmData2 change it.
# # shellcheck disable=SC2012
# FD2GRP_RW_FD2=$(ls -ld "$FD2_PATH" | cut -c 5-6 | grep "rw")
# if [ -z "$FD2GRP_RW_FD2" ]; then
#   echo "  Granting fd2grp RW access to $FD2_DIR."
#   sudo chmod -R g+rw "$FD2_PATH"
#   error_check
#   echo "  fd2grp granted RW access to $FD2_DIR."
# else
#   echo "  fd2grp has RW access to $FD2_DIR."
# fi

echo "33333" > ~/.fd2/gids/fd2grp.gid
