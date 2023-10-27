# On MacOS the GID's in the container do not need to
# match those on the host OS.  So we just use GID's
# that we know do not exist in the container.
mkdir ~/.fd2/gids
echo "3000" > ~/.fd2/gids/fd2grp.gid
echo "3001" > ~/.fd2/gids/docker.gid
