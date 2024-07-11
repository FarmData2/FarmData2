#!/bin/bash

TEST_COMMANDS=(
  "test.bash --comp"
  "test.bash --e2e --fd2 --live --glob=components/**/*.e2e.cy.js"
  "test.bash --unit --lib"
  "test.bash --unit --fd2"
  "test.bash --e2e --fd2 --live"
)

SED_SCRIPT="/Spec.*Tests/,/Tests Complete/p;/Running:/,/$/p;/failing/,/Results/p;"
GREP_SCRIPT="^\s*$"

for cmd in "${TEST_COMMANDS[@]}"; do
  echo ""
  echo "Running: $cmd"
  echo ""
  script -f -e -q -c "$cmd" /dev/null |
    sed -u -n "$SED_SCRIPT" |
    grep --line-buffered -v "$GREP_SCRIPT"
done
