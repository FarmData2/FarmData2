#!/bin/bash

apt update
apt install -y --no-install-recommends \
  ncat

apt clean
