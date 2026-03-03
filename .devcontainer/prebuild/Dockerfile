#FROM mcr.microsoft.com/devcontainers/javascript-node:0-18-bullseye
FROM mcr.microsoft.com/devcontainers/javascript-node:4-24-bookworm

# Install additional packages needed for the development enviornment.
RUN apt update \
  && apt install -y --no-install-recommends \
    build-essential \
    zip \
    jq \
  && apt-get clean -y \
  && apt-get autoclean -y \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

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

# Set the node version to be used."
# And make sure that node will run with a self-signed certificate.
# This is fine for the dev container, but should not be used in production.
RUN chown -R $USERNAME /usr/local/share/nvm \
  && bash -c "source /usr/local/share/nvm/nvm.sh; \
     nvm install 18.20.6; \
     npm install -g npm@10.8.2" \
  && echo "" >> /home/$USERNAME/.bashrc \
  && echo "export NODE_TLS_REJECT_UNAUTHORIZED='0'" >> /home/$USERNAME/.bashrc

# Setup git auto-completion for the non-root user.
RUN echo "" >> /home/$USERNAME/.bashrc \
  && echo "source /usr/share/bash-completion/completions/git" >> /home/$USERNAME/.bashrc

# The /bin/dash shell runs in fluxbox terminal by default.
# link it to /bin/bash instead so bash runs in fluxbox terminal..
RUN rm /bin/dash \
  && ln -s /bin/bash /bin/dash

USER $USERNAME
