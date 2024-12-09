# On Codespaces:
#   - The user vscode:
#     - has UID 1000
#     - is in the group vscode which has GID of 1000
#   - The group docker:
#     - has GID 102.

# Because we know this, we can take some shortcuts as compared
# to the full linux setup.

rm -rf "$FD2_PATH/.fd2/gids" &> /dev/null
mkdir "$FD2_PATH/.fd2/gids"

# Use the existing docker group
echo "102" > "$FD2_PATH/.fd2/gids/docker.gid"

# Assign the //var/run/docker.sock to the docker group
sudo chgrp docker /var/run/docker.sock

# The fd2grp is not important because the fd2dev user/group
# in the container have the same UID/GID as the vscode user
# in the codespace dev container.
echo "3000" > "$FD2_PATH/.fd2/gids/fd2grp.gid"
