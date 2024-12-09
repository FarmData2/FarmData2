#!/bin/bash

echo "fd2dev" | sudo -S chgrp docker /var/run/docker.sock
