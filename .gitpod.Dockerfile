FROM gitpod/workspace-base

RUN echo "exec /workspace/FarmData2/bin/fd2-up.bash" >> /home/gitpod/.bashrc
