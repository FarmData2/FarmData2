FROM mcr.microsoft.com/devcontainers/base:debian

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

# Username and password for the non-root user in the container.
# These must match the user in the fd2dev container image created
# in FD2-Images/fd2dev/
ARG USERNAME=fd2dev
ARG PASSWD=fd2dev

# Install some base applications.
RUN apt-get install --no-install-recommends -y \
  sudo \
  vim-tiny \
  nano \
  git

# Create the non-root user inside the container and give them sudo privlidges.
RUN useradd \
  -m $USERNAME -p "$(openssl passwd -1 $PASSWD)" \
  -s /bin/bash \
  -G sudo

USER $USERNAME
WORKDIR /home/$USERNAME

# Do some basic git configuration.
RUN git config --global credential.helper store \
  && git config --global merge.conflictstyle diff3 \
  && git config --global merge.tool vscode \
  && git config --global mergetool.keepBackup false \
  && git config --global core.editor "nano" \
  && git config --global pull.ff only \
  && git config --global init.defaultBranch main \
  && git config --global safe.directory '*' \
  && echo "" >> .bashrc \
  && echo "source /usr/share/bash-completion/completions/git" >> .bashrc

USER root

# Copy the postStart script into the container and make it executable.
# This is run by the devcontainer.json file.
COPY --chown=$USERNAME:$USERNAME ./postStart.bash ./postStart.bash
RUN chmod +x ./postStart.bash

# Stuff to reduce image size.
RUN apt-get clean -y \
  && apt-get autoclean -y \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

USER $USERNAME
WORKDIR /workspaces
