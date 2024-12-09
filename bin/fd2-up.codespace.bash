# On Codespaces:
#   - The user vscode:
#     - has UID 1000
#     - is in the group vscode which has GID of 1000
#   - The group docker:
#     - has GID 102, which matches the group in the container.

# Because we know this, we can take some shortcuts as compared
# to the full linux setup.

rm -rf "$FD2_PATH/.fd2/gids" &> /dev/null
mkdir "$FD2_PATH/.fd2/gids"

# Use the existing docker group
#   Note: The docker.sock does not need to be assigned to this group.
#         docker.sock is already assigned to the gitpod group
#         and the gitpod user is in the gitpod group.
echo "102" > "$FD_PATH/.fd2/gids/docker.gid"

# Use the existing vscode group as the fd2grp group.
#   Note: The vscode user is in the vscode group and
#         thus the fd2dev user will be in a group with the same GID.
echo "1000" > "$FD2_PATH/.fd2/gids/fd2grp.gid"
