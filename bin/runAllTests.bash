#!/bin/bash

test.bash --comp
test.bash --unit --lib
test.bash --unit --fd2
test.bash --e2e --fd2 --live
