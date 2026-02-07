FROM mcr.microsoft.com/devcontainers/javascript-node:0-18-bullseye

# Create a non-root user with UID that matches the UID of
# the postgres user in the fd2_postgres container.  This
# ensure proper permissions to the mounted docker/db directory.

ARG USERNAME=fd2dev
ARG USER_UID=999
ARG USER_GID=1001

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -s /bin/bash -m $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME