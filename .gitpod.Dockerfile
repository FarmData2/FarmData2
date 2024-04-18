FROM gitpod/workspace-base

RUN DIR=FarmData2 &&\
  echo "exec /workspace/$DIR/bin/fd2-up.bash" >> /home/gitpod/.bashrc
