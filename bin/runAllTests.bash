#!/bin/bash

test.bash --comp

# Temporary hack until test.bash is updated for these tests.
test.bash --e2e --fd2 --live --glob=components/**/*.e2e.cy.js

test.bash --unit --lib
test.bash --unit --fd2
test.bash --e2e --fd2 --live
