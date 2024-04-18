FROM gitpod/workspace-base

RUN DIR=$(basename $(ls /workspace)) &&\
  echo "exec /workspace/$DIR/bin/fd2-up.bash" >> /home/gitpod/.bashrc

