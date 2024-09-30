#!/bin/bash
# Push the a PR branch fetched with fetchPR.bash back
# to the PR author's fork to update the PR with local
# edits.

source colors.bash
source lib.bash

function usage {
  echo "pushPR.bash usage:"
  echo "  pushPR.bash <PR Number>"
  exit 1
}

if [ $# -ne 1 ]; then
  usage
fi

echo "Pushing PR $1..."
echo "  Getting PR information..."
PR_DATA=$(gh pr view "$1" --json headRefName --json headRepository --json headRepositoryOwner)
error_check "Unable to get PR data from GitHub."
PR_OWNER=$(echo "$PR_DATA" | jq -r '.headRepositoryOwner.login')
PR_REPO=$(echo "$PR_DATA" | jq -r '.headRepository.name')
PR_BRANCH=$(echo "$PR_DATA" | jq -r '.headRefName')
PR_LOCATION="$PR_OWNER/$PR_REPO/$PR_BRANCH"
echo "    Found PR $1 at $PR_LOCATION"

# Check that we are on the branch for the PR created by fetchPR.bash
CUR_BRANCH=$(git branch --show-current)
error_check "Unable to determine current branch."
if [ "$CUR_BRANCH" != "pr-$1-$PR_BRANCH" ]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} Must be on the PR branch to push a PR."
  echo "Switch to the pr-$1-$PR_BRANCH branch."
  echo "Then run this script again."
  exit 1
fi

echo "  Pushing $PR_LOCATION..."
git push --quiet "https://github.com/$PR_OWNER/$PR_REPO" "pr-$1-$PR_BRANCH:$PR_BRANCH"
error_check "Unable to push $PR_LOCATION."
echo "  Pushed."

echo "Done."
