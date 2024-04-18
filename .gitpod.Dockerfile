FROM gitpod/workspace-base

RUN echo "FD2_DIR=$(basename $(ls /workspace)); exec /workspace/$FD2_DIR/bin/fd2-up.bash" >> /home/gitpod/.bashrc

