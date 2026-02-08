#!/bin/bash

echo "test"
echo "test2"

if [ -z "$(PWD)" ]; then
  echo "a"
else
  echo "B"
fi

TEST=$(pwd)
echo "$TEST"
