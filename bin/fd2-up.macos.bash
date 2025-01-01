# On MacOS the GID's in the container do not need to
# match those on the host OS.  So we just use GID's
# that we know do not exist in the container.
rm -rf "$FD2_PATH/.fd2/gids" &> /dev/null
mkdir "$FD2_PATH/.fd2/gids"
echo "3000" > "$FD2_PATH/.fd2/gids/fd2grp.gid"
echo "3001" > "$FD2_PATH/.fd2/gids/docker.gid"
