Current idea:

.devcontainer is just the basics.
  - node
  - docker-in-docker
  - desktop-lite

Then once in we manually (or have the devcontainer in postStart) bring up the other containers using docker compose.

The specifications for the other containers postgres, fd2, and nginx will then be in /docker.
