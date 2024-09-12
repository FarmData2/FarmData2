#!/bin/bash
# Fetch a PR from the FarmData2 repository
# The branch for the PR is fetched from the author's fork.
# Assuming the PR author granted managers write access to the
# branch, this will allow the fetched branch to be edited and pushed
# back using pushPR.bash.

source colors.bash
source lib.bash

function usage {
  echo "fetchPR.bash usage:"
  echo "  fetchPR.bash <PR Number>"
  exit 1
}

if [ $# -ne 1 ]; then
  usage
fi

echo "Fetching PR $1..."
echo "  Getting PR information..."
PR_DATA=$(gh pr view "$1" --json headRefName --json headRepository --json headRepositoryOwner)
error_check "Unable to get PR data from GitHub."
PR_OWNER=$(echo "$PR_DATA" | jq -r '.headRepositoryOwner.login')
PR_REPO=$(echo "$PR_DATA" | jq -r '.headRepository.name')
PR_BRANCH=$(echo "$PR_DATA" | jq -r '.headRefName')
PR_LOCATION="$PR_OWNER/$PR_REPO/$PR_BRANCH"
echo "    Found PR $1 at $PR_LOCATION"

BRANCH_EXISTS=$(git branch -a | grep "pr-$1-$PR_BRANCH")
if [[ "$BRANCH_EXISTS" == *"pr-$1-$PR_BRANCH"* ]]; then
  echo -e "${ON_RED}ERROR:${NO_COLOR} The branch pr-$1-$PR_BRANCH already exists."
  echo "Delete that branch."
  echo "Then run this script again."
  exit 1
fi

echo "  Fetching $PR_LOCATION as PR-$1-$PR_BRANCH..."
git fetch --quiet "https://github.com/$PR_OWNER/$PR_REPO" "$PR_BRANCH:pr-$1-$PR_BRANCH"
error_check "Unable to fetch $PR_LOCATION as pr-$1-$PR_BRANCH."
echo "  Fetched."

echo "  Switching to branch pr-$1-$PR_BRANCH..."
git switch --quiet "pr-$1-$PR_BRANCH"
error_check "Unable to switch to branch pr-$1-$PR_BRANCH."
echo "  Switched."

echo "  Building the FarmData2 module..."
npm run build:fd2 &> /dev/null
echo "  Built."

echo "  Building the FarmData2 Examples module..."
npm run build:examples &> /dev/null
echo "  Built."

echo "Done."
