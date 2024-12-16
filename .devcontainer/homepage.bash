#!/bin/bash

HOME_PAGE_TEMPLATE=.devcontainer/homepage_template.md
HOME_PAGE=.devcontainer/fd2_welcome.md

# Make a copy so that it can be in .gitignore and not get committed.
cp "$HOME_PAGE_TEMPLATE" "$HOME_PAGE"

sed -i "s/%CODESPACE_NAME%/$CODESPACE_NAME/g" "$HOME_PAGE"
sed -i "s/%CACHE_KEY%/$(date +%s)/g" "$HOME_PAGE"
