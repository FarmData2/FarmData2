#!/bin/bash

current_branch=$(git branch --show-current)
if [ "$current_branch" != "development" ]; then
  echo "Please run bugInfo.bash from the development branch."
  exit 255
fi

upstream_url=$(git remote get-url upstream)
if [ "$upstream_url" == "" ]; then
  echo "Please set the upstream remote and try again."
  exit 255
fi

upstream_head=$(git ls-remote "$upstream_url" development | cut -f1)
local_head=$(git rev-parse HEAD)
if [ "$local_head" != "$upstream_head" ]; then
  echo "Please be sure you are running from the latest development branch."
  echo "Update your development branch, confirm the bug still exits and try again."
  exit 255
fi

git_status=$(git status --short)
if [ "$git_status" != "" ]; then
  echo "Please be sure you are running from the latest development branch."
  echo "Stash or restore any local changes you have made, confirm the bug still exits and try again."
  exit 255
fi

echo ""
echo "Copy the following information into the bug report under \"bugInfo.bash output\":"

echo ""
echo "BEGIN"

echo ""
echo "git remote -v"
echo "-------------"
git remote -v

echo ""
echo "git log -1 | head -3"
echo "--------------------"
git log -1 | head -3

echo ""
echo "cat ~/FarmData2/.fd2dev/db.conf"
echo "-------------------------------"
cat ~/FarmData2/.fd2dev/db.conf

echo ""
echo "docker ps (Images and Names)"
echo "----------------------------"
docker ps --format "{{.Image}} \t {{.Names}}"

echo ""
echo "END"
echo ""
